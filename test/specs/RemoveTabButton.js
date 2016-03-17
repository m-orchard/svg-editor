import {expect} from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import RemoveTabButton from '../../src/RemoveTabButton';
import {mockDOMSource} from '@cycle/dom';
import {Observable, Subject, BehaviorSubject} from 'rx';

describe('RemoveTabButton', () => {
    setup();

    let tabs$, selection$, click$;

    const tab1 = { name: 'one tab', data: 'a'};
    const tab2 = { name: 'two tab', data: 'b' };
    const tab3 = { name: 'three tab', data: 'c' };
    const originalTabs = [tab1, tab2, tab3];

    beforeEach(() => {
        click$ = new Subject();
        tabs$ = new BehaviorSubject(originalTabs);
        selection$ = new BehaviorSubject(0);

        const button = RemoveTabButton({
            DOM: mockDOMSource({
                ':root': {
                    'click': click$
                }
            }),
            tabs$,
            selection$
        });
    });

    describe('tabs$', () => {
        it('maintains the initial set of tabs', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            const tabs = callback.lastEvent();
            expect(tabs).to.eql(originalTabs);
        });

        it('removes the first tab when clicked with the initial selection', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs).to.eql([tab2, tab3]);
        });

        it('removes the second tab when clicked with the second tab selected', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            selection$.onNext(1);
            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs).to.eql([tab1, tab3]);
        });

        it('removes the third tab when clicked with the third tab selected', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            selection$.onNext(2);
            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs).to.eql([tab1, tab2]);
        });

        it('removes all tabs when clicked repeatedly', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);
            click$.onNext();
            click$.onNext();

            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs).to.eql([]);
        });

        it('does nothing when clicked with no tabs', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);
            click$.onNext();
            click$.onNext();
            click$.onNext();

            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs).to.eql([]);
        });
    });

    describe('selection$', () => {
        it('maintains the inital selection', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            const selection = callback.lastEvent();
            expect(selection).to.equal(0);
        });

        it('selects nothing when clicked with one tab', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);
            click$.onNext();
            click$.onNext();

            click$.onNext();

            const selection = callback.lastEvent();
            expect(selection).to.equal(-1);
        });

        it('selects nothing when clicked with no tabs', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);
            click$.onNext();
            click$.onNext();
            click$.onNext();

            click$.onNext();

            const selection = callback.lastEvent();
            expect(selection).to.equal(-1);
        });

        it('selects the first tab again when clicked with the first tab selected', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            click$.onNext();

            const selection = callback.lastEvent();
            expect(selection).to.equal(0);
        });

        it('selects the second tab again when clicked with the second tab selected', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            selection$.onNext(1);
            click$.onNext();

            const selection = callback.lastEvent();
            expect(selection).to.equal(1);
        });

        it('selects the new last tab when clicked with the last tab selected', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            selection$.onNext(2);
            click$.onNext();

            const selection = callback.lastEvent();
            expect(selection).to.equal(1);
        });
    });
});