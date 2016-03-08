import Tabs from './Tabs';
import SVGEditor from './SVGEditor';
import storage from './storage';
import {Observable, Subject} from 'rx';
import {run} from '@cycle/core';
import {makeDOMDriver, div} from '@cycle/dom';

const initialTabs = [
    { name: 'svg 1', data: '<rect x="5" y="5" height="10" width="10" fill="green"/>' },
    { name: 'svg 2', data: '<rect x="20" y="25" height="15" width="10" fill="blue"/>' }
];

function main(sources) {
    const tabSubject = new Subject();
    const tabs$ = tabSubject.startWith(initialTabs);
    const tabs = Tabs({ DOM: sources.DOM, tabs$: tabs$ });
    const vtabs$ = tabs.DOM;
    const veditor$ = SVGEditor({ DOM: sources.DOM, data$: tabs.selectedData$ }).DOM;
    const vapp$ = Observable.combineLatest(vtabs$, veditor$, (vtabs, veditor) => div('.app', [vtabs, veditor]));
    return {
        DOM: vapp$
    };
}

run(main, { DOM: makeDOMDriver('body') });