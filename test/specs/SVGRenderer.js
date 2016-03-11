import jsdom from 'mocha-jsdom';
import {expect} from 'chai';
import SVGRenderer from '../..//src/SVGRenderer';
import {Subject} from 'rx';

describe('SVGRenderer', () => {
    jsdom();

    let renderer, value$;

    beforeEach(() => {
        value$ = new Subject();
        renderer = SVGRenderer({ value$: value$ });
    });

    describe('DOM', () => {
        it('generates a single rect', () => {
            renderer.DOM.subscribe((vtree) => {
                expect(vtree.tagName).to.equal('svg');
                expect(vtree.children.length).to.equal(1);
                expect(vtree.children[0].tagName).to.equal('rect');
            });

            value$.onNext( '<rect></rect>');
        });

        it('generates two sibling rects', () => {
            renderer.DOM.subscribe((vtree) => {
                expect(vtree.tagName).to.equal('svg');
                expect(vtree.children.length).to.equal(2);
                expect(vtree.children[0].tagName).to.equal('rect');
                expect(vtree.children[1].tagName).to.equal('rect');
            });

            value$.onNext('<rect></rect><rect></rect>');
        });
    });
});