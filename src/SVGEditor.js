import {div, svg, textarea} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {fromString, sanitizeSVGNodes} from './virtualize';
import {Observable} from 'rx';

const initialImage = '<rect x="5" y="5" height="10" width="10" fill="green"/>';

function intent(DOMSource) {
    return DOMSource.select('.input')
        .events('input')
        .map(ev => ev.target.value);
}

function model(value$) {
    const startedValue$ = value$.startWith(initialImage);
    const vnodes$ = startedValue$.map(fromString).map(sanitizeSVGNodes);
    return Observable.combineLatest(startedValue$, vnodes$, (value, vnodes) => ({ value: value, nodes: vnodes }));
}

function view(state$) {
    return state$.map(state =>
        div('.svg-editor', [
            textarea('.svg-editor-input', { value: state.value }),
            svg('svg', { attributes: { class: 'svg-editor-result' } },
            state.nodes)
        ])
    );
}

function SVGEditor(sources) {
    const value$ = intent(sources.DOM);
    const state$ = model(value$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
}

export default sources => isolate(SVGEditor)(sources);