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
    const tabs$ = new BehaviorSubject(initialTabs);
    const tabs = Tabs({ DOM: sources.DOM, tabs$: tabs$ });
    const selection$ = tabs.selection$;
    const editor = SVGEditor({ DOM: sources.DOM, data$: tabs.data$ });
    const editorInput$ = editor.input$;

    editorInput$.subscribe(function(value) {
        const tabaData = tabs$.getValue();
        const selection = selection$.getValue();
        tabaData[selection].data = value;
        tabs$.onNext(tabaData);
    });

    const vtabs$ = tabs.DOM;
    const veditor$ = editor.DOM;
    const vapp$ = Observable.combineLatest(vtabs$, veditor$, (vtabs, veditor) =>
        div('.app', [vtabs, veditor])
    );

    return { DOM: vapp$ };
}

run(main, { DOM: makeDOMDriver('body') });