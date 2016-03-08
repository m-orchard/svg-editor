import Tabs from './Tabs';
import SVGEditor from './SVGEditor';
import storage from './storage';
import {Observable, BehaviorSubject} from 'rx';
import {run} from '@cycle/core';
import {makeDOMDriver, div} from '@cycle/dom';

const initialTabs = [
    { name: 'svg 1', data: '<rect x="5" y="5" height="10" width="10" fill="green"/>' },
    { name: 'svg 2', data: '<rect x="20" y="25" height="15" width="10" fill="blue"/>' }
];

function main(sources) {
    const tabs$ = new BehaviorSubject(storage.get('svg-data') || initialTabs);
    const names$ = tabs$.map(tabs => tabs.map(tab => tab.name));
    const tabs = Tabs({ DOM: sources.DOM, names$: names$ });

    const selection$ = tabs.selection$;
    const data$ = Observable.combineLatest(tabs$, selection$, (tabs, selection) => tabs[selection].data);
    const editor = SVGEditor({ DOM: sources.DOM, data$: data$ });
    const input$ = editor.input$;
    input$.subscribe(function(value) {
        const tabData = tabs$.getValue();
        const selection = selection$.getValue();
        tabData[selection].data = value;
        tabs$.onNext(tabData);
    });

    tabs$.subscribe(function(data) {
        storage.set('svg-data', data);
    });

    const vtabs$ = tabs.DOM;
    const veditor$ = editor.DOM;
    const vapp$ = Observable.combineLatest(vtabs$, veditor$, (vtabs, veditor) => div('.app', [vtabs, veditor]));
    return {
        DOM: vapp$
    };
}

run(main, { DOM: makeDOMDriver('body') });