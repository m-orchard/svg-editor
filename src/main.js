import Tabs from './Tabs';
import SVGEditor from './SVGEditor';
import {Observable} from 'rx';
import {run} from '@cycle/core';
import {makeDOMDriver, div} from '@cycle/dom';

function main(sources) {
    const vtabs$ = Tabs(sources).DOM;
    const veditor$ = SVGEditor(sources).DOM;
    const vapp$ = Observable.combineLatest(vtabs$, veditor$, (vtabs, veditor) => div('.app', [vtabs, veditor]));
    return {
        DOM: vapp$
    };
}

run(main, { DOM: makeDOMDriver('body') });