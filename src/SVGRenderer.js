import {fromString, sanitizeSVG} from './virtualize';
import {svg} from '@cycle/dom';
import isolate from '@cycle/isolate';

function model(value$) {
    return value$.startWith('')
        .map(fromString)
        .map(sanitizeSVG)
        .map(vnodes => ({vnodes}));
}

function view(state$) {
    return state$.map(({vnodes}) =>
        svg('svg', { attributes: { class: 'svg-renderer' } }, vnodes)
    );
}

function SVGRenderer({value$}) {
    const state$ = model(value$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
}

export default sources => isolate(SVGRenderer)(sources);