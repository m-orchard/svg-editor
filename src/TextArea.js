import {Observable} from 'rx';
import {div, textarea} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
    return DOMSource.select(':root')
        .events('input')
        .map(ev => ev.target.value);
}

function model(value$) {
    return value$.map(value => ({ value: value }));
}

function view(state$) {
    return state$.map(state => textarea({ value: state.value }));
}

function TextArea(sources) {
    const input$ = intent(sources.DOM);
    const value$ = Observable.merge(input$, sources.data$)
    const state$ = model(value$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        input$: input$,
        value$: value$
    };
}

export default sources => isolate(TextArea)(sources);