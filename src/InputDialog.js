import Input from './Input';
import Dialog from './Dialog';
import {Observable} from 'rx';
import isolate from '@cycle/isolate';

function InputDialog({ visible$, valueOnShow$ }, { DOM }) {
    const inputValue$ = visible$.filter(visible => visible)
        .withLatestFrom(valueOnShow$, (visible, value) => value);
    const input = Input({ DOM, enabled$: Observable.of(true), data$: inputValue$ });
    const dialog = Dialog({ DOM, visible$, vcontent$: input.DOM });
    const confirm$ = dialog.confirm$.withLatestFrom(input.value$, (event, value) => value);
    return {
        DOM: dialog.DOM,
        cancel$: dialog.cancel$,
        confirm$
    };
}

export default ({ DOM, visible$, valueOnShow$ }) => isolate(InputDialog)({ visible$, valueOnShow$ }, { DOM });