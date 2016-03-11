import {Observable} from 'rx';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(DOMSource) {
    return DOMSource.select(':root')
        .events('click');
}

function view(props$) {
    return props$.map(props => div('.button', [props.label]));
}

function Button(sources) {
    const click$ = intent(sources.DOM);
    const vtree$ = view(sources.props$);

    return {
        DOM: vtree$,
        click$: click$
    };
}

export default sources => isolate(Button)(sources);