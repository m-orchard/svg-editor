import {Observable, BehaviorSubject} from 'rx';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
    const selection$ = new BehaviorSubject(0);
    const click$ = DOMSource.select('.tab')
        .events('click')
        .map(ev => Number(ev.target.dataset.index));
    click$.subscribe(function(value) {
        selection$.onNext(value);
    });
    return selection$;
}

function model(selection$, tabs$) {
    return Observable.combineLatest(selection$, tabs$, (selection, tabs) =>
        ({ selection: selection, tabs: tabs })
    );
}

function view($state) {
    return $state.map(function(state) {
        const vtabs = state.tabs.map((tab, index) =>
            div('.tab' + (state.selection == index ? '.selected-tab' : ''), { dataset: { index: index } }, [tab.name])
        );
        return div('.tabs', vtabs);
    });
}

function Tabs(sources) {
    const selection$ = intent(sources.DOM);
    const state$ = model(selection$, sources.tabs$);
    const data$ = state$.map(state => state.tabs[state.selection].data);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        selection$: selection$,
        data$: data$
    }
}

export default sources => isolate(Tabs)(sources);