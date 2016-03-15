import Button from './Button';
import {Observable} from 'rx';
import isolate from '@cycle/isolate';

function getNewTabs(tabs, selection) {
    const newTabs = tabs.slice();
    newTabs.splice(selection, 1);
    return newTabs;
}

function getNewSelection(tabs, selection) {
    const newSelection = selection == tabs.length ? selection - 1 : selection;
    return newSelection;
}

function RemoveTabButton(sources) {
    const button = Button({ DOM: sources.DOM, props$: Observable.of({ label: '-' }) });
    const tabs$ = sources.tabs$;
    const selection$ = sources.selection$;
    const stateOnClick$ = button.click$.withLatestFrom(tabs$, selection$, (click, tabs, selection) => ({ tabs: tabs, selection: selection }));
    const newTabs$ = stateOnClick$.map(state => getNewTabs(state.tabs, state.selection));
    newTabs$.subscribe(tabs$);
    const newSelection$ = stateOnClick$.map(state => getNewSelection(state.tabs, state.selection));
    newSelection$.subscribe(selection$);
    return button;
}

export default sources => isolate(RemoveTabButton)(sources);