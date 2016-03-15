import Button from './Button';
import {Observable} from 'rx';
import isolate from '@cycle/isolate';

function getNewTabs(tabs, name) {
    const newTabs = tabs.slice();
    newTabs.push({ name: name, data: '' });
    return newTabs;
}

function getNewSelection(tabs) {
    return tabs.length - 1;
}

function AddTabButton(sources) {
    const button = Button({ DOM: sources.DOM, props$: Observable.of({ label: '+' }) });
    const tabs$ = sources.tabs$;
    const stateOnClick$ = button.click$.withLatestFrom(tabs$, sources.props$, (click, tabs, props) => ({ tabs: tabs, name: props.tabName}));
    const newTabs$ = stateOnClick$.map(state => getNewTabs(state.tabs, state.name));
    newTabs$.subscribe(tabs$);
    const newSelection$ = stateOnClick$.map(state => getNewSelection(state.tabs));
    newSelection$.subscribe(sources.selection$);
    return button;
}

export default sources => isolate(AddTabButton)(sources);