import {expect} from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import Tabs from '../../src/Tabs';
import {mockDOMSource} from '@cycle/dom';
import {Subject} from 'rx';

describe('Tabs', () => {
    setup();

    let tabs, names$, click$;

    beforeEach(() => {
        click$ = new Subject();
        names$ = new Subject();

        tabs = Tabs({
            DOM: mockDOMSource({
                '.tab': {
                    'click': click$
                }
            }),
            names$: names$
        });
    });

    describe('DOM', () => {
        it('renders no tabs', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            names$.onNext([]);

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('DIV');
            expect(vtree.properties.className).to.equal('tabs');
            expect(vtree.children.length).to.equal(0);
        });

        it('renders a single tab', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            const name = 'a single tab';
            names$.onNext([name]);

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('DIV');
            expect(vtree.properties.className).to.equal('tabs');
            expect(vtree.children.length).to.equal(1);
            expect(vtree.children[0].tagName).to.equal('DIV');
            expect(vtree.children[0].children[0].text).to.equal(name);
        });

        it('renders two tabs', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            const firstName = 'first tab';
            const secondName = 'second tab';
            names$.onNext([firstName, secondName]);

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('DIV');
            expect(vtree.properties.className).to.equal('tabs');
            expect(vtree.children.length).to.equal(2);
            expect(vtree.children[0].tagName).to.equal('DIV');
            expect(vtree.children[0].properties.className).to.equal('tab selected-tab');
            expect(vtree.children[0].children[0].text).to.equal(firstName);
            expect(vtree.children[1].tagName).to.equal('DIV');
            expect(vtree.children[1].properties.className).to.equal('tab');
            expect(vtree.children[1].children[0].text).to.equal(secondName);
        });

        it('adds a tab', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            const firstName = 'first tab';
            const secondName = 'second tab';
            const thirdName = 'third tab';
            names$.onNext([firstName, secondName]);
            names$.onNext([firstName, secondName, thirdName]);

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('DIV');
            expect(vtree.properties.className).to.equal('tabs');
            expect(vtree.children.length).to.equal(3);
            expect(vtree.children[0].tagName).to.equal('DIV');
            expect(vtree.children[0].properties.className).to.equal('tab selected-tab');
            expect(vtree.children[0].children[0].text).to.equal(firstName);
            expect(vtree.children[1].tagName).to.equal('DIV');
            expect(vtree.children[1].properties.className).to.equal('tab');
            expect(vtree.children[1].children[0].text).to.equal(secondName);
            expect(vtree.children[2].tagName).to.equal('DIV');
            expect(vtree.children[2].properties.className).to.equal('tab');
            expect(vtree.children[2].children[0].text).to.equal(thirdName);
        });

        it('removes a tab', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            const firstName = 'first tab';
            const secondName = 'second tab';
            const thirdName = 'third tab';
            names$.onNext([firstName, secondName, thirdName]);
            names$.onNext([firstName, secondName]);

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('DIV');
            expect(vtree.properties.className).to.equal('tabs');
            expect(vtree.children.length).to.equal(2);
            expect(vtree.children[0].tagName).to.equal('DIV');
            expect(vtree.children[0].properties.className).to.equal('tab selected-tab');
            expect(vtree.children[0].children[0].text).to.equal(firstName);
            expect(vtree.children[1].tagName).to.equal('DIV');
            expect(vtree.children[1].properties.className).to.equal('tab');
            expect(vtree.children[1].children[0].text).to.equal(secondName);
        });

        it('changes the selected tab when clicked', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            const firstName = 'first tab';
            const secondName = 'second tab';
            names$.onNext([firstName, secondName]);
            click$.onNext({ target: { dataset: { index: 1 } } })

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('DIV');
            expect(vtree.properties.className).to.equal('tabs');
            expect(vtree.children.length).to.equal(2);
            expect(vtree.children[0].tagName).to.equal('DIV');
            expect(vtree.children[0].properties.className).to.equal('tab');
            expect(vtree.children[0].children[0].text).to.equal(firstName);
            expect(vtree.children[1].tagName).to.equal('DIV');
            expect(vtree.children[1].properties.className).to.equal('tab selected-tab');
            expect(vtree.children[1].children[0].text).to.equal(secondName);
        });

        it('changes the selected tab when selected externally', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            const firstName = 'first tab';
            const secondName = 'second tab';
            names$.onNext([firstName, secondName]);
            tabs.selection$.onNext(1);

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('DIV');
            expect(vtree.properties.className).to.equal('tabs');
            expect(vtree.children.length).to.equal(2);
            expect(vtree.children[0].tagName).to.equal('DIV');
            expect(vtree.children[0].properties.className).to.equal('tab');
            expect(vtree.children[0].children[0].text).to.equal(firstName);
            expect(vtree.children[1].tagName).to.equal('DIV');
            expect(vtree.children[1].properties.className).to.equal('tab selected-tab');
            expect(vtree.children[1].children[0].text).to.equal(secondName);
        });
    });

    describe('selection$', () => {
        it('selects the first tab by default', () => {
            const callback = StreamCallback();
            tabs.selection$.subscribe(callback);

            const selection = callback.lastEvent();
            expect(selection).to.equal(0);
        });

        it('selects the second tab when clicked', () => {
            const callback = StreamCallback();
            tabs.selection$.subscribe(callback);

            click$.onNext({ target: { dataset: { index: 1 } } });

            const selection = callback.lastEvent();
            expect(selection).to.equal(1);
        });

        it('selects the second tab when selected externally', () => {
            const callback = StreamCallback();
            tabs.selection$.subscribe(callback);

            tabs.selection$.onNext(1);

            const selection = callback.lastEvent();
            expect(selection).to.equal(1);
        });
    });
});