import {fromString, sanitizeSVGNodes} from './virtualize';
import {Observable} from 'rx';
import {div, svg, textarea} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
    return DOMSource.select('.svg-editor-input')
        .events('input')
        .map(ev => ev.target.value);
}

function model(input$, data$) {
    const value$ = Observable.merge(input$, data$);
    const vnodes$ = value$.map(fromString)
        .map(sanitizeSVGNodes);
    return Observable.combineLatest(value$, vnodes$, (value, vnodes) =>
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
    const input$ = intent(sources.DOM);
    const state$ = model(input$, sources.data$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        input$: input$
    };
}

export default sources => isolate(SVGEditor)(sources);