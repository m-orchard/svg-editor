import {Observable} from 'rx';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
    return DOMSource.select(':root')
        .events('click');
}

function view(props$) {
    return props$.startWith('')
        .map(({label}) => div('.button', [label]));
}

function Button({DOM, props$}) {
    const click$ = intent(DOM);
    const vtree$ = view(props$);
    return {
        DOM: vtree$,
        click$
    };
}

export default sources => isolate(Button)(sources);