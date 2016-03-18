import chai, {expect} from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import Dialog from '../../src/Dialog';
import {div, span, mockDOMSource} from '@cycle/dom';
import {Subject} from 'rx';

describe('Dialog', () => {
    setup();

    let dialog, visible$, vcontent$, confirmClick$, cancelClick$;

    const vhiddenDialog = div('.dialog-hidden');
    const vdialogControls = div('.dialog-controls', [div('.button'), div('.button')]);
    const vemptyDialog = div('.dialog-overlay', [div('.dialog', [vdialogControls])]);
    const vcontent = div('.some-content', [span('.child-content')]);
    const vdialogWithContent = div('.dialog-overlay', [div('.dialog', [vcontent, vdialogControls])]);

    beforeEach(() => {
        visible$ = new Subject();
        vcontent$ = new Subject();
        confirmClick$ = new Subject();
        cancelClick$ = new Subject();

        dialog = Dialog({
            DOM: mockDOMSource({
                ':root': {
                    'click': confirmClick$
                }
            }),
            visible$,
            vcontent$
        });
    });

    describe('DOM', () => {
        it('renders an empty element when initially hidden', () => {
            const callback = StreamCallback();
            dialog.DOM.subscribe(callback);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vhiddenDialog);
        });

        it('renders the dialog when made visible without content', () => {
            const callback = StreamCallback();
            dialog.DOM.subscribe(callback);

            visible$.onNext(true);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vemptyDialog);
        });

        it('renders the dialog with content when made visible with content', () => {
            const callback = StreamCallback();
            dialog.DOM.subscribe(callback);
            vcontent$.onNext(vcontent);

            visible$.onNext(true);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vdialogWithContent);
        });

        it('renders an empty element when made hidden without content', () => {
            const callback = StreamCallback();
            dialog.DOM.subscribe(callback);
            visible$.onNext(true);

            visible$.onNext(false);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vhiddenDialog);
        });

        it('renders an empty element when made hidden with content', () => {
            const callback = StreamCallback();
            dialog.DOM.subscribe(callback);
            vcontent$.onNext(div('.some-content', [span('.child-content')]));
            visible$.onNext(true);

            visible$.onNext(false);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vhiddenDialog);
        });

        it('renders an empty element when confirm is clicked', () => {
            const callback = StreamCallback();
            dialog.DOM.subscribe(callback);
            vcontent$.onNext(div('.some-content', [span('.child-content')]));
            visible$.onNext(true);

            confirmClick$.onNext();

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vhiddenDialog);
        });

        it('renders an empty element when cancel is clicked', () => {
            const callback = StreamCallback();
            dialog.DOM.subscribe(callback);
            vcontent$.onNext(div('.some-content', [span('.child-content')]));
            visible$.onNext(true);

            cancelClick$.onNext();

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vhiddenDialog);
        });
    });

    describe('confirm$', () => {
        it('forwards a confirm click', () => {
            const spy = chai.spy(() => {});
            dialog.confirm$.subscribe(spy);

            confirmClick$.onNext();

            expect(spy).to.be.called();
        });
    });

    describe('cancel$', () => {
        it('forwards a cancel click', () => {
            const spy = chai.spy(() => {});
            dialog.cancel$.subscribe(spy);

            cancelClick$.onNext();

            expect(spy).to.be.called();
        });
    });
});