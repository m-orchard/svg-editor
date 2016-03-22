import chai, {expect} from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import InputDialog from '../../src/InputDialog';
import {div, input, mockDOMSource} from '@cycle/dom';
import {Subject} from 'rx';

describe('InputDialog', () => {
    setup();

    let dialog, visible$, valueOnShow$, confirmClick$, cancelClick$, input$;

    const vdialog = div('.dialog-overlay', [div('.dialog', [input({ value: undefined }), div('.dialog-controls')])]);

    function inputEvent(value) {
        return { target: { value } };
    }

    beforeEach(() => {
        visible$ = new Subject();
        valueOnShow$ = new Subject();
        confirmClick$ = new Subject();
        cancelClick$ = new Subject();
        input$ = new Subject();

        dialog = InputDialog({
            DOM: mockDOMSource({
                ':root': {
                    'click': confirmClick$,
                    'input': input$
                }
            }),
            visible$,
            valueOnShow$
        });
    });

    describe('DOM', () => {
        it('renders the dialog with an input when made visible', () => {
            const callback = StreamCallback();
            dialog.DOM.subscribe(callback);

            visible$.onNext(true);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vdialog);
        });

        it('renders the dialog with the initial value when made visible', () => {
            const callback = StreamCallback();
            dialog.DOM.subscribe(callback);

            valueOnShow$.onNext('some data');
            visible$.onNext(true);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vdialog);
            expect(vtree.children[0].children[0]).to.look.like(input({ value: 'some data' }));
        });

        it('does not change the input if the initial value changes when made visible', () => {
            const callback = StreamCallback();
            dialog.DOM.subscribe(callback);
            valueOnShow$.onNext('some data');
            visible$.onNext(true);

            valueOnShow$.onNext('alternate data');

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vdialog);
            expect(vtree.children[0].children[0]).to.look.like(input({ value: 'some data' }));
        });

        it('renders the dialog with new the initial value when made visible again', () => {
            const callback = StreamCallback();
            dialog.DOM.subscribe(callback);
            valueOnShow$.onNext('some data');
            visible$.onNext(true);

            valueOnShow$.onNext('alternate data');
            visible$.onNext(false);
            visible$.onNext(true);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vdialog);
            expect(vtree.children[0].children[0]).to.look.like(input({ value: 'alternate data' }));
        });
    });

    describe('confirm$', () => {
        it('forwards a confirm click with the input value', () => {
            const callback = StreamCallback();
            dialog.confirm$.subscribe(callback);

            visible$.onNext(true);
            input$.onNext(inputEvent('some data'));
            confirmClick$.onNext();

            const value = callback.lastEvent();
            expect(value).to.equal('some data');
        });
    });
});