import {Observable} from 'rx';
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
        ({ names, selection })
    );
}

function view($state) {
    return $state.map(function({names, selection}) {
        const vtabs = names.map((name, index) =>
            div('.tab' + (selection == index ? '.selected-tab' : ''), { dataset: { index } }, [name])
        );
        return div('.tabs', vtabs);
    });
}

function Tabs({DOM, selection$, names$}) {
    const click$ = intent(DOM);
    click$.subscribe(selection$);
    const state$ = model(names$, selection$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
}

export default sources => isolate(Tabs)(sources);