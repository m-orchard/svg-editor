import {fromString, sanitizeSVGNodes} from './virtualize';
import {Observable} from 'rx';
import {div, svg, textarea} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
    return DOMSource.select('.svg-editor-input')
        .events('input')
        .map(ev => ev.target.value);
}

function model(value$, data$) {
    const inputValue$ = Observable.merge(value$, data$);
    const vnodes$ = inputValue$.map(fromString).map(sanitizeSVGNodes);
    return Observable.combineLatest(inputValue$, vnodes$, (value, vnodes) =>
        ({ value: value, nodes: vnodes })
    );
}

function view(state$) {
    return state$.map(state =>
        div('.svg-editor', [
            textarea('.svg-editor-input', { value: state.value }),
            svg('svg', { attributes: { class: 'svg-editor-result' } }, state.nodes)
        ])
    );
}

function SVGEditor(sources) {
    const value$ = intent(sources.DOM);
    const state$ = model(value$, sources.data$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
}

export default sources => isolate(SVGEditor)(sources);