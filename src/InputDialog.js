import Input from './Input';
import Dialog from './Dialog';
import {Observable} from 'rx';
import isolate from '@cycle/isolate';

function model(dialogConfirm$, dialogCancel$, inputValue$, inputEnterPress$, inputEscapePress$) {
    const confirm$ = Observable.merge(dialogConfirm$, inputEnterPress$)
        .withLatestFrom(inputValue$, (event, value) => value);
    const cancel$ = Observable.merge(dialogCancel$, inputEscapePress$);
    return { confirm$, cancel$ };
}

function InputDialog({ visible$, valueOnShow$ }, { DOM }) {
    const inputValue$ = visible$.filter(visible => visible)
        .withLatestFrom(valueOnShow$, (visible, value) => value);
    const input = Input({ DOM, enabled$: Observable.of(true), data$: inputValue$ });
    const enterPress$ = input.keyup$.filter(key => key == 13);
    const escapePress$ = input.keyup$.filter(key => key == 27);
    const keyPressClose$ = Observable.merge(enterPress$, escapePress$)
        .map(() => false);
    const visibleOrKeyPress$ = Observable.merge(visible$, keyPressClose$);
    const dialog = Dialog({ DOM, visible$: visibleOrKeyPress$, vcontent$: input.DOM });
    const { confirm$, cancel$ } = model(dialog.confirm$, dialog.cancel$, input.value$, enterPress$, escapePress$);
    return {
        DOM: dialog.DOM,
        confirm$,
        cancel$
    };
}

export default ({ DOM, visible$, valueOnShow$ }) => isolate(InputDialog)({ visible$, valueOnShow$ }, { DOM });