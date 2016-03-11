import chai from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import TextArea from '../../src/TextArea';
import {mockDOMSource} from '@cycle/dom';
import {Subject} from 'rx';

describe('TextArea', () => {
    setup();
    const expect = chai.expect;

    let textArea, input$, data$;

    beforeEach(() => {
        input$ = new Subject();
        data$ = new Subject();
        textArea = TextArea({
            DOM: mockDOMSource({
                ':root': {
                    'input': input$
                }
            }),
            data$: data$
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