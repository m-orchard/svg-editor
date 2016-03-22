import Button from './Button';
import {Observable} from 'rx';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function model(visible$, confirmClick$, cancelClick$) {
    const close$ = Observable.merge(confirmClick$, cancelClick$)
        .map(() => false);
    return Observable.merge(visible$, close$)
        .startWith(false)
        .map(visible => ({ visible }));
}

function view(state$, vconfirmButton$, vcancelButton$, vcontent$) {
    const vcontrols$ = Observable.combineLatest(vconfirmButton$, vcancelButton$, (vconfirmButton, vcancelButton) =>
        div('.dialog-controls', [vconfirmButton, vcancelButton])
    );
    const vinitialContent$ = vcontent$.startWith(div());
    return Observable.combineLatest(state$, vinitialContent$, vcontrols$, ({ visible }, vcontent, vcontrols) => {
        const vdialog = div('.dialog-overlay', [div('.dialog', [vcontent, vcontrols])]);
        if(!visible) {
            return div('.dialog-hidden', vdialog);
        }
        return vdialog;
    });
}

function Dialog({ DOM, visible$, vcontent$ }) {
    const confirmButton = Button({ DOM, props$: Observable.of({ label: 'o' }) });
    const cancelButton = Button({ DOM, props$: Observable.of({ label: 'x' }) });
    const confirmClick$ = confirmButton.click$;
    const cancelClick$ = cancelButton.click$;
    const state$ = model(visible$, confirmClick$, cancelClick$);
    const vtree$ = view(state$, confirmButton.DOM, cancelButton.DOM, vcontent$);
    return {
        DOM: vtree$,
        confirm$: confirmClick$,
        cancel$: cancelClick$
    }
}

export default sources => isolate(Dialog)(sources);