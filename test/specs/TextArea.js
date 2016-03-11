import jsdom from 'mocha-jsdom';
import {expect} from 'chai';
import TextArea from '../../src/TextArea';
import {mockDOMSource} from '@cycle/dom';
import {Subject} from 'rx';

describe('TextArea', () => {
    jsdom();

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
        it('displays input value', () => {
            const input = '<rect></rect>';

            textArea.DOM.subscribe((vtree) => {
                expect(vtree.tagName).to.equal('TEXTAREA');
                expect(vtree.properties.value).to.equal(input);
            });

            input$.onNext({ target: { value: input } });
        });

        it('displays data value', () => {
            const data = '<rect></rect>';

            textArea.DOM.subscribe((vtree) => {
                expect(vtree.tagName).to.equal('TEXTAREA');
                expect(vtree.properties.value).to.equal(data);
            });

            data$.onNext(data);
        });
    });
});