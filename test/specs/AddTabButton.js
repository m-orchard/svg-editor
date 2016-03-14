import chai from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import AddTabButton from '../../src/AddTabButton';
import {mockDOMSource} from '@cycle/dom';
import {Observable, Subject, BehaviorSubject} from 'rx';

describe('AddTabButton', () => {
    setup();
    const expect = chai.expect;

    const tabName = 'new tab';
    let button, tabs$, selection$, props$, click$;

    beforeEach(() => {
        click$ = new Subject();
        tabs$ = new BehaviorSubject([{ name: 'one tab', data: 'a'}, { name: 'two tab', data: 'b' }]);
        selection$ = new BehaviorSubject(0);
        props$ = new Observable.of({ tabName: tabName });

        button = AddTabButton({
            DOM: mockDOMSource({
                ':root': {
                    'click': click$
                }
            }),
            tabs$: tabs$,
            selection$: selection$,
            props$: props$
        });
    });

    describe('tabs$', () => {
        it('maintains the initial set of tabs', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            const tabs = callback.lastEvent();
            expect(tabs.length).to.equal(2);
            expect(tabs[0].name).to.equal('one tab');
            expect(tabs[0].data).to.equal('a');
            expect(tabs[1].name).to.equal('two tab');
            expect(tabs[1].data).to.equal('b');
        });

        it('adds a new tab when clicked', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs.length).to.equal(3);
            expect(tabs[0].name).to.equal('one tab');
            expect(tabs[0].data).to.equal('a');
            expect(tabs[1].name).to.equal('two tab');
            expect(tabs[1].data).to.equal('b');
            expect(tabs[2].name).to.equal('new tab');
            expect(tabs[2].data).to.equal('');
        });
    });

    describe('selection$', () => {
        it('maintains the inital selection', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            const selection = callback.lastEvent();
            expect(selection).to.equal(0);
        });

        it('selects the last tab when clicked', () => {
            const callback = StreamCallback();
            selection$.subscribe(callback);

            click$.onNext();

            const selection = callback.lastEvent();
            expect(selection).to.equal(2);
        });
    });
});