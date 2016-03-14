import {expect} from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import RemoveTabButton from '../../src/RemoveTabButton';
import {mockDOMSource} from '@cycle/dom';
import {Observable, Subject, BehaviorSubject} from 'rx';

describe('RemoveTabButton', () => {
    setup();

    let button, tabs$, selection$, click$;

    beforeEach(() => {
        click$ = new Subject();
        tabs$ = new BehaviorSubject([{ name: 'one tab', data: 'a'}, { name: 'two tab', data: 'b' }, { name: 'three tab', data: 'c' }]);
        selection$ = new BehaviorSubject(0);

        button = RemoveTabButton({
            DOM: mockDOMSource({
                ':root': {
                    'click': click$
                }
            }),
            tabs$: tabs$,
            selection$: selection$
        });
    });

    describe('tabs$', () => {
        it('maintains the initial set of tabs', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            const tabs = callback.lastEvent();
            expect(tabs.length).to.equal(3);
            expect(tabs[0].name).to.equal('one tab');
            expect(tabs[0].data).to.equal('a');
            expect(tabs[1].name).to.equal('two tab');
            expect(tabs[1].data).to.equal('b');
            expect(tabs[2].name).to.equal('three tab');
            expect(tabs[2].data).to.equal('c');
        });

        it('removes the only tab when clicked', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);
            click$.onNext();
            click$.onNext();

            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs.length).to.equal(0);
        });

        it('does nothing when clicked with no tabs', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);
            click$.onNext();
            click$.onNext();
            click$.onNext();

            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs.length).to.equal(0);
        });

        it('removes the first tab when clicked with the initial selection', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs.length).to.equal(2);
            expect(tabs[0].name).to.equal('two tab');
            expect(tabs[0].data).to.equal('b');
            expect(tabs[1].name).to.equal('three tab');
            expect(tabs[1].data).to.equal('c');
        });

        it('removes the second tab when clicked with the second tab selected', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            selection$.onNext(1);
            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs.length).to.equal(2);
            expect(tabs[0].name).to.equal('one tab');
            expect(tabs[0].data).to.equal('a');
            expect(tabs[1].name).to.equal('three tab');
            expect(tabs[1].data).to.equal('c');
        });

        it('removes the third tab when clicked with the third tab selected', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            selection$.onNext(2);
            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs.length).to.equal(2);
            expect(tabs[0].name).to.equal('one tab');
            expect(tabs[0].data).to.equal('a');
            expect(tabs[1].name).to.equal('two tab');
            expect(tabs[1].data).to.equal('b');
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