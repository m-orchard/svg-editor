import chai, {expect} from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import Input from '../../src/Input';
import {input, textarea, mockDOMSource} from '@cycle/dom';
import {Subject} from 'rx';

describe('Input', () => {
    setup();

    let inputComponent, input$, keyup$, data$, enabled$, type$;

    function inputEvent(value) {
        return { target: { value } };
    };

    function keyupEvent(value) {
        return { keyCode: value };
    };

    beforeEach(() => {
        input$ = new Subject();
        keyup$ = new Subject();
        data$ = new Subject();
        enabled$ = new Subject();
        type$ = new Subject();
        inputComponent = Input({
            DOM: mockDOMSource({
                ':root': {
                    'input': input$,
                    'keyup': keyup$
                }
            }),
            data$,
            enabled$,
            type$
        });
    });

    describe('DOM', () => {
        it('renders an input element with no type specified', () => {
            const callback = StreamCallback();
            inputComponent.DOM.subscribe(callback);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(input());
        });

        it('renders an input element with input type specified', () => {
            const callback = StreamCallback();
            inputComponent.DOM.subscribe(callback);

            type$.onNext('input');

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(input());
        });

        it('renders an input element with textarea type specified', () => {
            const callback = StreamCallback();
            inputComponent.DOM.subscribe(callback);

            type$.onNext('textarea');

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(textarea());
        });

        it('renders an input value', () => {
            const callback = StreamCallback();
            inputComponent.DOM.subscribe(callback);

            const value = 'some input';
            input$.onNext(inputEvent(value));

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(input({ value }));
        });

        it('renders a data value', () => {
            const callback = StreamCallback();
            inputComponent.DOM.subscribe(callback);

            const value = 'some data';
            data$.onNext(value);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(input({ value }));
        });

        it('does not have a disabled attribute when enabled', () => {
            const callback = StreamCallback();
            inputComponent.DOM.subscribe(callback);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(input({ attributes: { disabled: undefined }}));
        });

        it('has a disabled attribute when disabled', () => {
            const callback = StreamCallback();
            inputComponent.DOM.subscribe(callback);

            enabled$.onNext(false);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(input({ attributes: { disabled: true }}));
        });

        it('does not have a disabled attribute when reenabled', () => {
            const callback = StreamCallback();
            inputComponent.DOM.subscribe(callback);

            enabled$.onNext(false);
            enabled$.onNext(true);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(input({ attributes: { disabled: undefined }}));
        });
    });

    describe('value$', () => {
        it('exposes an input value', () => {
            const callback = StreamCallback();
            inputComponent.value$.subscribe(callback);

            const value = 'some input';
            input$.onNext(inputEvent(value));

            const result = callback.lastEvent();
            expect(result).to.equal(value);
        });

        it('exposes a data value', () => {
            const callback = StreamCallback();
            inputComponent.value$.subscribe(callback);

            const value = 'some data';
            data$.onNext(value);

            const result = callback.lastEvent();
            expect(result).to.equal(value);
        });
    });

    describe('input$', () => {
        it('exposes an input value', () => {
            const callback = StreamCallback();
            inputComponent.input$.subscribe(callback);

            const value = 'some input';
            input$.onNext(inputEvent(value));

            const result = callback.lastEvent();
            expect(result).to.equal(value);
        });

        it('does not expose a data value', () => {
            const spy = chai.spy(() => {});
            inputComponent.input$.subscribe(spy);

            data$.onNext('some data');

            expect(spy).not.to.be.called();
        });
    });

    describe('keyup$', () => {
        it('exposes a keyup event', () => {
            const callback = StreamCallback();
            inputComponent.keyup$.subscribe(callback);

            const value = 3;
            keyup$.onNext(keyupEvent(value));

            const result = callback.lastEvent();
            expect(result).to.equal(value);
        });
    });
});