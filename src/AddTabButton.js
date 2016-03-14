import Button from './Button';
import {Observable} from 'rx';
import isolate from '@cycle/isolate';

function AddTabButton(sources) {
    const buttonProps$ = Observable.of({ label: '+' });
    const button = Button({ DOM: sources.DOM, props$: buttonProps$ });
    const click$ = button.click$;
    const tabs$ = sources.tabs$;
    const selection$ = sources.selection$;
    const newName$ = Observable.combineLatest(sources.props$, click$, props => props.tabName);
    newName$.subscribe(name => {
        const tabs = tabs$.getValue().slice();
        const count = tabs.push({ name: name, data: '' });
        tabs$.onNext(tabs);
        selection$.onNext(count - 1);
    });
    return button;
}

export default sources => isolate(AddTabButton)(sources);