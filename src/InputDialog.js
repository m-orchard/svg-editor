import Button from './Button';
import Input from './Input';
import Dialog from './Dialog';
import {Observable} from 'rx';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function TabNameDialog({ visible$, data$ }, { DOM }) {
    const dataOnVisible$ = visible$.filter(visible => visible)
        .withLatestFrom(data$, (visible, data) => data);
    const input = Input({ DOM, enabled$: Observable.of(true), data$: dataOnVisible$ });
    const dialog = Dialog({ DOM, visible$, vcontent$: input.DOM });
    const confirm$ = dialog.confirm$.withLatestFrom(input.value$, (event, value) => value);
    return {
        DOM: dialog.DOM,
        cancel$: dialog.cancel$,
        confirm$
    };
}

export default ({ DOM, visible$, data$ }) => isolate(TabNameDialog)({ visible$, data$ }, { DOM });