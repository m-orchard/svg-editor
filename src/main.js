import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import SVGEditor from './SVGEditor';

function main(sources) {
    return {
        DOM: SVGEditor(sources).DOM
    };
}

run(main, { DOM: makeDOMDriver('#app') });