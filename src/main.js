import Tabs from './Tabs';
import Button from './Button';
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
    selection$.onNext(storedData ? storedData.selection : initialSelection);

    const addTabButtonProps$ = Observable.of({ label: '+' });
    const addTabButton = Button({ DOM: sources.DOM, props$: addTabButtonProps$ });
    const addTabClick$ = addTabButton.click$;
    addTabClick$.subscribe(() => {
        const svgs = svgs$.getValue();
        const svgCount = svgs.push({ name: 'svg', data: '' });
        svgs$.onNext(svgs);
        selection$.onNext(svgCount - 1);
    });

    const state$ = Observable.combineLatest(svgs$, selection$, (svgs, selection) => ({ svgs: svgs, selection: selection }));
    state$.subscribe(state => {
        storage.set('svg-data', state);
    });

    const currentData$ = state$.map(state => state.svgs[state.selection].data);
    const svgInput = TextArea({ DOM: sources.DOM, data$: currentData$ });
    const value$ = svgInput.value$;
    const svgRenderer = SVGRenderer({ value$: value$ });

    const input$ = svgInput.input$;
    input$.subscribe(value => {
        const svgs = svgs$.getValue();
        const selection = selection$.getValue();
        svgs[selection].data = value;
        svgs$.onNext(svgs);
    });

    const vtabs$ = tabs.DOM;
    const vaddTabButton$ = addTabButton.DOM;
    const vcontrols$ = Observable.combineLatest(vtabs$, vaddTabButton$, (tabs, addTabButton) => div('.controls', [tabs, addTabButton]));
    const veditor$ = Observable.combineLatest(svgInput.DOM, svgRenderer.DOM, (input, renderer) => div('.svg-editor', [input, renderer]));
    const vapp$ = Observable.combineLatest(vcontrols$, veditor$, (vcontrols, veditor) => div('.app', [vcontrols, veditor]));
    return {
        DOM: vapp$
    };
}

run(main, { DOM: makeDOMDriver('body') });