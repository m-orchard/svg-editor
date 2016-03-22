import chai, {expect} from 'chai';
import setup from '../../helpers/setup';
import StreamCallback from '../../helpers/StreamCallback';
import Dialog from '../../../src/component/Dialog';
import {div, span, mockDOMSource} from '@cycle/dom';
import {Subject} from 'rx';

describe('Dialog', () => {
    setup();

    let callback, dialog, visible$, vcontent$, confirmClick$, cancelClick$;

    const vcontent = div('.some-content', [span('.child-content')]);
    const vdialogControls = div('.dialog-controls', [div('.button'), div('.button')]);
    const vemptyDialog = div('.dialog-overlay', [div('.dialog', [div(), vdialogControls])]);
    const vhiddenEmptyDialog = div('.dialog-hidden', [vemptyDialog]);
    const vdialog = div('.dialog-overlay', [div('.dialog', [vcontent, vdialogControls])]);
    const vhiddenDialog = div('.dialog-hidden', [vdialog]);

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

    describe('DOM', function() {
        beforeEach(() => {
            callback = StreamCallback();
            dialog.DOM.subscribe(callback);
        });

        describe('without content', () => {
            DOMTests(vhiddenEmptyDialog, vemptyDialog);
        });

        describe('with content', () => {
            beforeEach(() => {
                vcontent$.onNext(vcontent);
            });

            DOMTests(vhiddenDialog, vdialog, true);
        });

        function DOMTests(vhiddenDialog, vvisibleDialog) {
            it('hides the empty dialog initially', () => {
                const vtree = callback.lastEvent();
                expect(vtree).to.look.like(vhiddenDialog);
            });

            it('shows the dialog when made visible', () => {
                visible$.onNext(true);

                const vtree = callback.lastEvent();
                expect(vtree).to.look.like(vvisibleDialog);
            });

            it('hides the dialog when made hidden', () => {
                visible$.onNext(true);

                visible$.onNext(false);

                const vtree = callback.lastEvent();
                expect(vtree).to.look.like(vhiddenDialog);
            });

            it('hides the dialog when confirm is clicked', () => {
                visible$.onNext(true);

                confirmClick$.onNext();

                const vtree = callback.lastEvent();
                expect(vtree).to.look.like(vhiddenDialog);
            });

            it('hides the dialog when cancel is clicked', () => {
                visible$.onNext(true);

                cancelClick$.onNext();

                const vtree = callback.lastEvent();
                expect(vtree).to.look.like(vhiddenDialog);
            });
        }
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