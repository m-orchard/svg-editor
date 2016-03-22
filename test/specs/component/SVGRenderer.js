import {expect} from 'chai';
import setup from '../../helpers/setup';
import StreamCallback from '../../helpers/StreamCallback';
import SVGRenderer from '../../../src/component/SVGRenderer';
import {Subject} from 'rx';

describe('SVGRenderer', () => {
    setup();

    let renderer, value$;

    beforeEach(() => {
        value$ = new Subject();
        renderer = SVGRenderer({ value$ });
    });

    describe('DOM', () => {
        it('renders a single rect', () => {
            const callback = StreamCallback();
            renderer.DOM.subscribe(callback);

            value$.onNext('<rect></rect>');

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('svg');
            expect(vtree.children.length).to.equal(1);
            expect(vtree.children[0].tagName).to.equal('rect');
        });

        it('renders two sibling rects', () => {
            const callback = StreamCallback();
            renderer.DOM.subscribe(callback);

            value$.onNext('<rect></rect><rect></rect>');

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('svg');
            expect(vtree.children.length).to.equal(2);
            expect(vtree.children[0].tagName).to.equal('rect');
            expect(vtree.children[1].tagName).to.equal('rect');
        });

        it('renders a single rect with attributes', () => {
            const callback = StreamCallback();
            renderer.DOM.subscribe(callback);

            value$.onNext('<rect width="10" height="5" fill="red"></rect>');

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('svg');
            expect(vtree.children.length).to.equal(1);
            expect(vtree.children[0].tagName).to.equal('rect');
            expect(vtree.children[0].properties.attributes.width).to.equal('10');
            expect(vtree.children[0].properties.attributes.height).to.equal('5');
            expect(vtree.children[0].properties.attributes.fill).to.equal('red');
        });
    });
});