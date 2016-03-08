import {Observable, BehaviorSubject} from 'rx';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
    const selection$ = new BehaviorSubject(0);
    const click$ = DOMSource.select('.tab')
        .events('click')
        .map(ev => Number(ev.target.dataset.index));
    click$.subscribe(selection$);
    return selection$;
}

function model(selection$, names$) {
    return Observable.combineLatest(selection$, names$, (selection, names) =>
        ({ selection: selection, names: names })
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
    const selection$ = intent(sources.DOM);
    const state$ = model(selection$, sources.names$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        selection$: selection$
    }
}

export default sources => isolate(Tabs)(sources);