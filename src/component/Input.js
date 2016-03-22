import {Observable} from 'rx';
import {input, textarea} from '@cycle/dom';
import isolate from '@cycle/isolate';

const inputTypes = { input, textarea };

function intent(DOMSource) {
    const input$ = DOMSource.select(':root')
        .events('input')
        .map(ev => ev.target.value);
    const keyup$ = DOMSource.select(':root')
        .events('keyup')
        .map(ev => ev.key || ev.keyCode);
    return { input$, keyup$ };
}

function model(value$, enabled$, type$) {
    const initialValue$ = value$.startWith('');
    const initialEnabled$ = enabled$.startWith(true);
    const initialNode$ = type$.startWith('input')
        .map(type => inputTypes[type]);
    return Observable.combineLatest(initialValue$, initialEnabled$, initialNode$, (value, enabled, node) =>
        ({ value, enabled, node })
    );
}

function view(state$) {
    return Observable.combineLatest(state$, ({ enabled, value, node }) => {
        const attributes = {};
        if(!enabled) {
            attributes.disabled = true;
        }
        return node({ value, attributes });
    });
}

function Input({ DOM, data$, enabled$, type$ = Observable.empty() }) {
    const { input$, keyup$ } = intent(DOM);
    const value$ = Observable.merge(input$, data$)
    const state$ = model(value$, enabled$, type$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        input$,
        keyup$,
        value$
    };
}

export default sources => isolate(Input)(sources);