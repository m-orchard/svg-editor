import {Observable} from 'rx';
import {div, textarea} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
    return DOMSource.select(':root')
        .events('input')
        .map(ev => ev.target.value);
}

function model(value$, enabled$) {
    const initialValue$ = value$.startWith('');
    const initialEnabled$ = enabled$.startWith(true);
    return Observable.combineLatest(initialValue$, initialEnabled$, (value, enabled) =>
        ({ value: value, enabled: enabled })
    );
}

function view(state$) {
    return state$.map(state => {
        const attributes = {};
        if(!state.enabled) {
            attributes.disabled = true;
        }
        return textarea({ value: state.value, attributes: attributes })
    });
}

function TextArea(sources) {
    const input$ = intent(sources.DOM);
    const value$ = Observable.merge(input$, sources.data$)
    const state$ = model(value$, sources.enabled$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        input$: input$,
        value$: value$
    };
}

export default sources => isolate(TextArea)(sources);