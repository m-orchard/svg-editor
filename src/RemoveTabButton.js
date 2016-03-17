import Button from './Button';
import {Observable} from 'rx';
import isolate from '@cycle/isolate';

function getNewTabs({tabs, selection}) {
    const newTabs = tabs.slice();
    newTabs.splice(selection, 1);
    return newTabs;
}

function getNewSelection({tabs, selection}) {
    const newSelection = selection == tabs.length ? selection - 1 : selection;
    return newSelection;
}

function RemoveTabButton({DOM, tabs$, selection$}) {
    const button = Button({ DOM, props$: Observable.of({ label: '-' }) });
    const stateOnClick$ = button.click$.withLatestFrom(tabs$, selection$, (click, tabs, selection) => ({ tabs, selection }));
    const newTabs$ = stateOnClick$.map(getNewTabs);
    newTabs$.subscribe(tabs$);
    const newSelection$ = stateOnClick$.map(getNewSelection);
    newSelection$.subscribe(selection$);
    return {
        DOM: button.DOM
    };
}

export default sources => isolate(RemoveTabButton)(sources);