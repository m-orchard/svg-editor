import {Observable} from 'rx';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
    return DOMSource.select('.tab')
        .events('click')
        .map(ev => Number(ev.target.dataset.index));
}

function model(value$, tabs$) {
    const selectedIndex$ = value$.startWith(0);
    return Observable.combineLatest(selectedIndex$, tabs$, (selectedIndex, tabs) =>
        ({ selectedIndex: selectedIndex, tabs: tabs })
    );
}

function view($state) {
    return $state.map(function(state) {
        const vtabs = state.tabs.map((tab, index) =>
            div('.tab' + (state.selectedIndex == index ? '.selected-tab' : ''), { dataset: { index: index } }, [tab.name])
        );
        return div('.tabs', vtabs);
    });
}

function Tabs(sources) {
    const value$ = intent(sources.DOM);
    const state$ = model(value$, sources.tabs$);
    const selectedData$ = state$.map(state => state.tabs[state.selectedIndex].data);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        selectedData$: selectedData$
    }
}

export default sources => isolate(Tabs)(sources);