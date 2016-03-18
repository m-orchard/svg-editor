import {expect} from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import Tabs from '../../src/Tabs';
import {div, mockDOMSource} from '@cycle/dom';
import {Subject} from 'rx';

describe('Tabs', () => {
    setup();

    let tabs, click$, names$, selection$;

    const tab1Name = 'first tab';
    const tab2Name = 'second tab';
    const tab3Name = 'third tab';
    const vemptyTabs = div('.tabs', []);
    const voneTab = div('.tabs', [div('.tab', [tab1Name])]);
    const vtwoTabs = div('.tabs', [div('.tab', [tab1Name]), div('.tab', [tab2Name])]);
    const vsecondTabSelected = div('.tabs', [div('.tab', [tab1Name]), div('.tab.selected-tab', [tab2Name])]);
    const vthreeTabs = div('.tabs', [div('.tab', [tab1Name]), div('.tab', [tab2Name]), div('.tab', [tab3Name])]);

    function clickEvent(index) {
        return { target: { dataset: { index } } };
    }

    beforeEach(() => {
        click$ = new Subject();
        names$ = new Subject();
        selection$ = new Subject();

        tabs = Tabs({
            DOM: mockDOMSource({
                '.tab': {
                    'click': click$
                }
            }),
            names$,
            selection$
        });
    });

    describe('DOM', () => {
        it('renders no tabs', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            names$.onNext([]);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vemptyTabs);
        });

        it('renders a single tab', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            names$.onNext([tab1Name]);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(voneTab);
        });

        it('renders two tabs', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            names$.onNext([tab1Name, tab2Name]);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vtwoTabs);
        });

        it('adds a tab', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            names$.onNext([tab1Name, tab2Name]);
            names$.onNext([tab1Name, tab2Name, tab3Name]);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vthreeTabs);
        });

        it('removes a tab', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            names$.onNext([tab1Name, tab2Name, tab3Name]);
            names$.onNext([tab1Name, tab2Name]);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vtwoTabs);
        });

        it('changes the selected tab when clicked', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            names$.onNext([tab1Name, tab2Name]);
            click$.onNext(clickEvent(1));

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vsecondTabSelected);
        });

        it('changes the selected tab when selected externally', () => {
            const callback = StreamCallback();
            tabs.DOM.subscribe(callback);

            names$.onNext([tab1Name, tab2Name]);
            selection$.onNext(1);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vsecondTabSelected);
        });
    });

    describe('selection$', () => {
        it('has no selection by default', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            const selection = callback.lastEvent();
            expect(selection).to.be.undefined;
        });

        it('selects no tab when selected externally', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            selection$.onNext(-1);

            const selection = callback.lastEvent();
            expect(selection).to.equal(-1);
        });

        it('selects the first tab when clicked', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            click$.onNext(clickEvent(0));

            const selection = callback.lastEvent();
            expect(selection).to.equal(0);
        });

        it('selects the first tab when selected externally', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            selection$.onNext(0);

            const selection = callback.lastEvent();
            expect(selection).to.equal(0);
        });

        it('selects the second tab when clicked', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            click$.onNext(clickEvent(1));

            const selection = callback.lastEvent();
            expect(selection).to.equal(1);
        });

        it('selects the second tab when selected externally', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            selection$.onNext(1);

            const selection = callback.lastEvent();
            expect(selection).to.equal(1);
        });
    });
});