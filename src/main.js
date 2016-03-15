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
    const selection$ = new BehaviorSubject(storedData ? storedData.selection : initialSelection);
    const svgs$ = new BehaviorSubject(storedData ? storedData.svgs : initialSVGs);
    const names$ = svgs$.map(svgs => svgs.map(svg => svg.name));
    const state$ = Observable.combineLatest(svgs$, selection$, (svgs, selection) => ({ svgs: svgs, selection: selection }));
    const validSelection$ = state$.map(state => (0 <= state.selection && state.selection < state.svgs.length));
    const currentData$ = state$.withLatestFrom(validSelection$, (state, validSelection) => (validSelection ? state.svgs[state.selection].data : ''));

    state$.subscribe(state => {
        storage.set('svg-data', state);
    });

    const tabs = Tabs({ DOM: sources.DOM, names$: names$, selection$: selection$ });
    const addTabButton = AddTabButton({ DOM: sources.DOM, tabs$: svgs$, selection$: selection$, props$: Observable.of({ tabName: 'svg' }) });
    const removeTabButton = RemoveTabButton({ DOM: sources.DOM, tabs$: svgs$, selection$: selection$ });
    const svgInput = TextArea({ DOM: sources.DOM, data$: currentData$, enabled$: validSelection$ });
    const svgRenderer = SVGRenderer({ value$: svgInput.value$ });

    const newSVGs$ = svgInput.input$.withLatestFrom(svgs$, selection$, (value, svgs, selection) => {
        const newSVGs = svgs.slice();
        newSVGs[selection] = { name: newSVGs[selection].name, data: value };
        return svgs;
    });
    newSVGs$.subscribe(svgs$);

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