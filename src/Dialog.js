import Button from './Button';
import {Observable} from 'rx';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(confirm$, cancel$) {
    return Observable.merge(confirm$, cancel$).map(() => false);
}

function model(visible$) {
    return visible$.startWith(false)
        .map(visible => ({ visible }));
}

function view(state$, vcontent$) {
    return Observable.combineLatest(state$, vcontent$, ({ visible }, vcontent) => {
        if(!visible) {
            return div('.dialog-hidden');
        }
        return div('.dialog-overlay', [div('.dialog', vcontent)]);
    });
}

function getContentsStream(vcontent$, vconfirmButton$, vcancelButton$) {
    const vcontrols$ = Observable.combineLatest(vconfirmButton$, vcancelButton$, (vconfirmButton, vcancelButton) =>
        div('.dialog-controls', [vconfirmButton, vcancelButton])
    );
    const vinitialContent$ = vcontent$.startWith([]);
    return Observable.combineLatest(vinitialContent$, vcontrols$, (vcontent, vcontrols) => {
        let vcontentArray = vcontent;
        if(!Array.isArray(vcontentArray)) {
            vcontentArray = [vcontentArray];
        }
        return vcontentArray.concat(vcontrols);
    });
}

function Dialog({ DOM, visible$, vcontent$ }) {
    const confirmButton = Button({ DOM, props$: Observable.of({ label: 'o' }) });
    const cancelButton = Button({ DOM, props$: Observable.of({ label: 'x' }) });
    const confirm$ = confirmButton.click$;
    const cancel$ = cancelButton.click$;
    const close$ = intent(confirm$, cancel$);
    const visibleOrClose$ = Observable.merge(close$, visible$);
    const state$ = model(visibleOrClose$);
    const vcontents$ = getContentsStream(vcontent$, confirmButton.DOM, cancelButton.DOM);
    const vtree$ = view(state$, vcontents$);
    return {
        DOM: vtree$,
        confirm$,
        cancel$
    }
}

export default sources => isolate(Dialog)(sources);