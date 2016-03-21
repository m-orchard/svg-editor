import {Subject} from 'rx';

function getNewTabs({ tabs, selection }) {
    if(selection < 0 || tabs.length <= selection) {
        return null;
    }
    const newTabs = tabs.slice();
    newTabs.splice(selection, 1);
    return newTabs;
}

function getNewSelection({ tabs, selection }) {
    return selection < tabs.length ? selection : tabs.length - 1;
}

function RemoveTab({ tabs$, selection$ }) {
    const subject = new Subject();
    const newTabs$ = subject.withLatestFrom(tabs$, selection$, (event, tabs, selection) => ({ tabs, selection }))
        .map(getNewTabs)
        .filter(tabs => tabs != null)
        .share();
    const newSelection$ = newTabs$.withLatestFrom(selection$, (tabs, selection) => ({ tabs, selection }))
        .map(getNewSelection);
    newTabs$.subscribe(tabs$);
    newSelection$.subscribe(selection$);
    return subject;
}

export default RemoveTab;