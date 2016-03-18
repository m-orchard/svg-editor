import Button from './Button';
import InputDialog from './InputDialog';
import {Observable} from 'rx';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function getNewTabs({ tabs, selection, value }) {
    const newTabs = tabs.slice();
    newTabs[selection].name = value;
    return newTabs;
}

function RenameTabButton({ tabs$, selection$ }, { DOM }) {
    const button = Button({ DOM, props$: Observable.of({ label: '_' }) });
    const visible$ = button.click$.map(event => true);
    const data$ = Observable.combineLatest(tabs$, selection$, (tabs, selection) => tabs[selection] ? tabs[selection].name : '');
    const dialog = InputDialog({ DOM, data$, visible$ });
    const stateOnConfirm$ = dialog.confirm$.withLatestFrom(tabs$, selection$, (value, tabs, selection) => ({ value, tabs, selection }));
    const newTabs$ = stateOnConfirm$.map(getNewTabs);
    newTabs$.subscribe(tabs$);
    const vtree$ = Observable.combineLatest(button.DOM, dialog.DOM, (vbutton, vdialog) => div([vbutton, vdialog]));
    return {
        DOM: vtree$
    };
}

export default ({ DOM, tabs$, selection$ }) => isolate(RenameTabButton)({ tabs$, selection$ }, { DOM });