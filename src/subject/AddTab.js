import {Subject} from 'rx';

function getNewTabs({ tabs, name }) {
    return tabs.concat({ name, data: '' });
}

function getNewSelection({ tabs }) {
    return tabs.length - 1;
}

function AddTab({ tabs$, selection$, name$ }) {
    const subject = new Subject();
    const stateOnTrigger$ = subject.withLatestFrom(tabs$, name$, (event, tabs, name) => ({ tabs, name }));
    stateOnTrigger$.map(getNewTabs).subscribe(tabs$);
    stateOnTrigger$.map(getNewSelection).subscribe(selection$);
    return subject;
}

export default AddTab;