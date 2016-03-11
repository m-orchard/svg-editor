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

function main(sources) {
    const svgs$ = new BehaviorSubject(storage.get('svg-data') || initialSVGs);
    const names$ = svgs$.map(svgs => svgs.map(svg => svg.name));
    const tabs = Tabs({ DOM: sources.DOM, names$: names$ });

    const addTabButtonProps$ = Observable.of({ label: '+' });
    const addTabButton = Button({ DOM: sources.DOM, props$: addTabButtonProps$ });
    const addTabClick$ = addTabButton.click$;
    addTabClick$.subscribe(() => {
        const svgs = svgs$.getValue();
        svgs.push({ name: 'svg', data: '' });
        svgs$.onNext(svgs);
    });

    const selection$ = tabs.selection$;
    const currentData$ = Observable.combineLatest(svgs$, selection$, (svgs, selection) => svgs[selection].data);
    const textArea = TextArea({ DOM: sources.DOM, data$: currentData$ });
    const value$ = textArea.value$;
    const renderer = SVGRenderer({ value$: value$ });

    const input$ = textArea.input$;
    input$.subscribe(value => {
        const svgs = svgs$.getValue();
        const selection = selection$.getValue();
        svgs[selection].data = value;
        svgs$.onNext(svgs);
    });

    svgs$.subscribe(tabs => {
        storage.set('svg-data', tabs);
    });

    const vtabs$ = tabs.DOM;
    const vaddTabButton$ = addTabButton.DOM;
    const vcontrols$ = Observable.combineLatest(vtabs$, vaddTabButton$, (tabs, addTabButton) => div('.controls', [tabs, addTabButton]));
    const veditor$ = Observable.combineLatest(textArea.DOM, renderer.DOM, (textArea, renderer) => div('.svg-editor', [textArea, renderer]));
    const vapp$ = Observable.combineLatest(vcontrols$, veditor$, (vcontrols, veditor) => div('.app', [vcontrols, veditor]));
    return {
        DOM: vapp$
    };
}

run(main, { DOM: makeDOMDriver('body') });