import {Observable, BehaviorSubject} from 'rx';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
    return DOMSource.select('.tab')
        .events('click')
        .map(ev => Number(ev.target.dataset.index));
}

function model(names$, selection$) {
    const initialNames$ = names$.startWith([]);
    const initialSelection$ = selection$.startWith(-1);
    return Observable.combineLatest(initialNames$, initialSelection$, (names, selection) =>
        ({ names: names, selection: selection })
    );
}

function view($state) {
    return $state.map(function(state) {
        const vtabs = state.names.map((name, index) =>
            div('.tab' + (state.selection == index ? '.selected-tab' : ''), { dataset: { index: index } }, [name])
        );
        return div('.tabs', vtabs);
    });
}

function Tabs(sources) {
    const click$ = intent(sources.DOM);
    const selection$ = new BehaviorSubject(0);
    click$.subscribe(selection$);
    const state$ = model(sources.names$, selection$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        selection$: selection$
    };
}

export default sources => isolate(Tabs)(sources);