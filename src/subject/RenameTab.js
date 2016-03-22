import {Subject} from 'rx';

function getNewTabs({ tabs, selection, name }) {
    if(selection < 0 || tabs.length <= selection) {
        return null;
    }
    const newTabs = tabs.slice();
    newTabs[selection].name = name;
    return newTabs;
}

function RenameTab({ tabs$, selection$ }) {
    const subject = new Subject();
    const newTabs$ = subject.withLatestFrom(tabs$, selection$, (name, tabs, selection) => ({ name, tabs, selection }))
        .map(getNewTabs)
        .filter(tabs => tabs != null);
    newTabs$.subscribe(tabs$);
    return subject;
}

export default RenameTab;