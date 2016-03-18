import Button from './Button';
import {Observable} from 'rx';
import isolate from '@cycle/isolate';

function getNewTabs({ tabs, name }) {
    const newTabs = tabs.slice();
    newTabs.push({ name, data: '' });
    return newTabs;
}

function getNewSelection({ tabs }) {
    return tabs.length - 1;
}

function AddTabButton({ props$, tabs$, selection$ }, { DOM }) {
    const button = Button({ DOM, props$: Observable.of({ label: '+' }) });
    const stateOnClick$ = button.click$.withLatestFrom(tabs$, props$, (click, tabs, { tabName }) => ({ tabs, name: tabName }));
    const newTabs$ = stateOnClick$.map(getNewTabs);
    newTabs$.subscribe(tabs$);
    const newSelection$ = stateOnClick$.map(getNewSelection);
    newSelection$.subscribe(selection$);
    return {
        DOM: button.DOM
    };
}

export default ({ DOM, props$, tabs$, selection$ }) => isolate(AddTabButton)({ props$, tabs$, selection$ }, { DOM });