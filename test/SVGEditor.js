import jsdom from 'mocha-jsdom';
import {expect} from 'chai';
import SVGEditor from '../src/SVGEditor';
import {mockDOMSource} from '@cycle/dom';
import {Observable, Subject} from 'rx';

describe('SVGEditor', () => {
    jsdom();

    let editor, input$, data$;

    beforeEach(() => {
        input$ = new Subject();
        data$ = new Subject();
        editor = SVGEditor({
            DOM: mockDOMSource({
                '.svg-editor-input': {
                    'input': input$
                }
            }),
            data$: data$
        });
    });

    describe('DOM', () => {
        it('generates a single rect', () => {
            const input = '<rect></rect>';

            editor.DOM.subscribe((vtree) => {
                expect(vtree.children[0].tagName).to.equal('TEXTAREA');
                expect(vtree.children[0].properties.value).to.equal(input);
                expect(vtree.children[1].tagName).to.equal('svg');
                expect(vtree.children[1].children.length).to.equal(1);
                expect(vtree.children[1].children[0].tagName).to.equal('rect');
            });

            input$.onNext({ target: { value: input } });
        });

        it('generates two sibling rects', () => {
            const input = '<rect></rect><rect></rect>';

            editor.DOM.subscribe((vtree) => {
                expect(vtree.children[0].tagName).to.equal('TEXTAREA');
                expect(vtree.children[0].properties.value).to.equal(input);
                expect(vtree.children[1].tagName).to.equal('svg');
                expect(vtree.children[1].children.length).to.equal(2);
                expect(vtree.children[1].children[0].tagName).to.equal('rect');
                expect(vtree.children[1].children[1].tagName).to.equal('rect');
            });

            input$.onNext({ target: { value: input } });
        });
    });
});