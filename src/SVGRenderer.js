import {fromString, sanitizeSVG} from './virtualize';
import {svg} from '@cycle/dom';
import isolate from '@cycle/isolate';

function model(value$) {
    return value$.map(fromString)
        .map(sanitizeSVG)
        .map(vnodes => ({ nodes: vnodes }));
}

function view(state$) {
    return state$.map(state =>
        svg('svg', { attributes: { class: 'svg-renderer' } }, state.nodes)
    );
}

function SVGRenderer(sources) {
    const state$ = model(sources.value$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
}

export default sources => isolate(SVGRenderer)(sources);