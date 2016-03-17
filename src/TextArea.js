import {Observable} from 'rx';
import {textarea} from '@cycle/dom';
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
        ({ value, enabled })
    );
}

function view(state$) {
    return state$.map(({enabled, value}) => {
        const attributes = {};
        if(!enabled) {
            attributes.disabled = true;
        }
        return textarea({ value, attributes })
    });
}

function TextArea({DOM, data$, enabled$}) {
    const input$ = intent(DOM);
    const value$ = Observable.merge(input$, data$)
    const state$ = model(value$, enabled$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        input$,
        value$
    };
}

export default sources => isolate(TextArea)(sources);