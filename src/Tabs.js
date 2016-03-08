import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
    return DOMSource.select('.tab')
        .events('click')
        .map(ev => Number(ev.target.dataset.index));
}

function model(value$) {
    return value$.startWith(0).map(index => ({ selectedIndex: index, tabs: ['tab 1', 'tab 2'] }));
}

function view($state) {
    return $state.map(function(state) {
        const vtabs = state.tabs.map((name, index) =>
            div('.tab' + (state.selectedIndex == index ? '.selected-tab' : ''), { dataset: { index: index } }, [name])
        );
        return div('.tabs', vtabs);
    });
}

function Tabs(sources) {
    const value$ = intent(sources.DOM);
    const state$ = model(value$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    }
}

export default sources => isolate(Tabs)(sources);