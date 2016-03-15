import Tabs from './Tabs';
import AddTabButton from './AddTabButton';
import RemoveTabButton from './RemoveTabButton';
import TextArea from './TextArea';
import SVGRenderer from './SVGRenderer';
import storage from './storage';
import {Observable, BehaviorSubject} from 'rx';
import {run} from '@cycle/core';
import {makeDOMDriver, div} from '@cycle/dom';

const initialSVGs = [
    { name: 'svg 1', data: '<rect x="5" y="15" height="10" width="10" fill="orange"/>' },
    { name: 'svg 2', data: '<rect x="20" y="25" height="15" width="10" fill="red"/>' }
];
const initialSelection = 0;

function main(sources) {
    const storedData = storage.get('svg-data');
    const svgs$ = new BehaviorSubject(storedData ? storedData.svgs : initialSVGs);

    const names$ = svgs$.map(svgs => svgs.map(svg => svg.name));
    const tabs = Tabs({ DOM: sources.DOM, names$: names$ });

    const selection$ = tabs.selection$;
    const selection = storedData ? storedData.selection : initialSelection;
    selection$.onNext(selection);

    const state$ = Observable.combineLatest(svgs$, selection$, (svgs, selection) => ({ svgs: svgs, selection: selection }));
    state$.subscribe(state => {
        storage.set('svg-data', state);
    });

    const addTabProps$ = Observable.of({ tabName: 'svg' });
    const addTabButton = AddTabButton({ DOM: sources.DOM, tabs$: svgs$, selection$: selection$, props$: addTabProps$ });
    const removeTabButton = RemoveTabButton({ DOM: sources.DOM, tabs$: svgs$, selection$: selection$ });

    const validSelection$ = state$.map(state => (0 <= state.selection && state.selection < state.svgs.length));
    const currentData$ = state$.withLatestFrom(validSelection$, (state, validSelection) => (validSelection ? state.svgs[state.selection].data : ''));
    const svgInput = TextArea({ DOM: sources.DOM, data$: currentData$, enabled$: validSelection$ });
    const input$ = svgInput.input$;
    input$.subscribe(value => {
        const svgs = svgs$.getValue().slice();
        const selection = selection$.getValue();
        svgs[selection] = { name: svgs[selection].name, data: value };
        svgs$.onNext(svgs);
    });

    const value$ = svgInput.value$;
    const svgRenderer = SVGRenderer({ value$: value$ });

    const vleftControls$ = Observable.combineLatest(tabs.DOM, addTabButton.DOM, (vtabs, vaddTabButton) => div('.controls.left-controls', [vtabs, vaddTabButton]));
    const vrightControls$ = Observable.combineLatest(removeTabButton.DOM, vremoveTabButton => div('.controls.right-controls', [vremoveTabButton]));
    const vcontrols$ = Observable.combineLatest(vleftControls$, vrightControls$, (vleftControls, vrightControls) => div('.controls', [vleftControls, vrightControls]));
    const veditor$ = Observable.combineLatest(svgInput.DOM, svgRenderer.DOM, (vinput, vrenderer) => div('.svg-editor', [vinput, vrenderer]));
    const vapp$ = Observable.combineLatest(vcontrols$, veditor$, (vcontrols, veditor) => div('.app', [vcontrols, veditor]));
    return {
        DOM: vapp$
    };
}

run(main, { DOM: makeDOMDriver('body') });