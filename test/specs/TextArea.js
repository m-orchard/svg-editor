import chai from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import TextArea from '../../src/TextArea';
import {mockDOMSource} from '@cycle/dom';
import {Subject} from 'rx';

describe('TextArea', () => {
    setup();
    const expect = chai.expect;

    let textArea, input$, data$, enabled$;

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
            data$: data$,
            enabled$: enabled$
        });
    });

    describe('DOM', () => {
        it('renders an input value', () => {
            const callback = StreamCallback();
            textArea.DOM.subscribe(callback);

            const input = 'some input';
            input$.onNext({ target: { value: input } });

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('TEXTAREA');
            expect(vtree.properties.value).to.equal(input);
        });

        it('renders a data value', () => {
            const callback = StreamCallback();
            textArea.DOM.subscribe(callback);

            const data = 'some data';
            data$.onNext(data);

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('TEXTAREA');
            expect(vtree.properties.value).to.equal(data);
        });

        it('does not have a disabled attribute when enabled', () => {
            const callback = StreamCallback();
            textArea.DOM.subscribe(callback);

            const vtree = callback.lastEvent();
            expect(vtree.properties.attributes.disabled).to.be.undefined;
        });

        it('has a disabled attribute when disabled', () => {
            const callback = StreamCallback();
            textArea.DOM.subscribe(callback);

            enabled$.onNext(false);

            const vtree = callback.lastEvent();
            expect(vtree.properties.attributes.disabled).to.be.true;
        });

        it('does not have a disabled attribute when reenabled', () => {
            const callback = StreamCallback();
            textArea.DOM.subscribe(callback);

            enabled$.onNext(false);
            enabled$.onNext(true);

            const vtree = callback.lastEvent();
            expect(vtree.properties.attributes.disabled).to.be.undefined;
        });
    });

    describe('value$', () => {
        it('exposes an input value', () => {
            const callback = StreamCallback();
            textArea.value$.subscribe(callback);

            const input = 'some input';
            input$.onNext({ target: { value: input } });

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
            input$.onNext({ target: { value: input } });

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