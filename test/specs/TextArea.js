import chai, {expect} from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import TextArea from '../../src/TextArea';
import {textarea, mockDOMSource} from '@cycle/dom';
import {Subject} from 'rx';

describe('TextArea', () => {
    setup();

    let textArea, input$, data$, enabled$;

    function inputEvent(value) {
        return { target: {value} };
    };

    beforeEach(() => {
        input$ = new Subject();
        data$ = new Subject();
        enabled$ = new Subject();
        textArea = TextArea({
            DOM: mockDOMSource({
                ':root': {
                    'input': input$
                }
            }),
            data$,
            enabled$
        });
    });

    describe('DOM', () => {
        it('renders an input value', () => {
            const callback = StreamCallback();
            textArea.DOM.subscribe(callback);

            const input = 'some input';
            input$.onNext(inputEvent(input));

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(textarea({ value: input }));
        });

        it('renders a data value', () => {
            const callback = StreamCallback();
            textArea.DOM.subscribe(callback);

            const data = 'some data';
            data$.onNext(data);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(textarea({ value: data }));
        });

        it('does not have a disabled attribute when enabled', () => {
            const callback = StreamCallback();
            textArea.DOM.subscribe(callback);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(textarea({ attributes: { disabled: undefined }}));
        });

        it('has a disabled attribute when disabled', () => {
            const callback = StreamCallback();
            textArea.DOM.subscribe(callback);

            enabled$.onNext(false);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(textarea({ attributes: { disabled: true }}));
        });

        it('does not have a disabled attribute when reenabled', () => {
            const callback = StreamCallback();
            textArea.DOM.subscribe(callback);

            enabled$.onNext(false);
            enabled$.onNext(true);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(textarea({ attributes: { disabled: undefined }}));
        });
    });

    describe('value$', () => {
        it('exposes an input value', () => {
            const callback = StreamCallback();
            textArea.value$.subscribe(callback);

            const input = 'some input';
            input$.onNext(inputEvent(input));

            const value = callback.lastEvent();
            expect(value).to.equal(input);
        });

        it('exposes a data value', () => {
            const callback = StreamCallback();
            textArea.value$.subscribe(callback);

            const data = 'some data';
            data$.onNext(data);

            const value = callback.lastEvent();
            expect(value).to.equal(data);
        });
    });

    describe('input$', () => {
        it('exposes an input value', () => {
            const callback = StreamCallback();
            textArea.input$.subscribe(callback);

            const input = 'some input';
            input$.onNext(inputEvent(input));

            const result = callback.lastEvent();
            expect(result).to.equal(input);
        });

        it('does not expose a data value', () => {
            const spy = chai.spy(() => {});
            textArea.input$.subscribe(spy);

            data$.onNext('some data');

            expect(spy).not.to.be.called();
        });
    });
});