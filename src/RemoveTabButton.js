import Button from './Button';
import {Observable} from 'rx';
import isolate from '@cycle/isolate';

function RemoveTabButton(sources) {
    const buttonProps$ = Observable.of({ label: '-' });
    const button = Button({ DOM: sources.DOM, props$: buttonProps$ });
    const click$ = button.click$;
    const tabs$ = sources.tabs$;
    const selection$ = sources.selection$;
    click$.subscribe(name => {
        const tabs = tabs$.getValue().slice();
        const selection = selection$.getValue();
        tabs.splice(selection, 1);
        if(selection == tabs.length) {
            selection$.onNext(tabs.length - 1);
        }
        tabs$.onNext(tabs);
    });
    return button;
}

export default sources => isolate(RemoveTabButton)(sources);