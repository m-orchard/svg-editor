import {expect} from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import RenameTabButton from '../../src/RenameTabButton';
import {mockDOMSource} from '@cycle/dom';
import {Observable, Subject, BehaviorSubject} from 'rx';

describe('RenameTabButton', () => {
    setup();

    let tabs$, selection$, click$;

    const tabName = 'new tab';
    const originalTabs = [{ name: 'one tab', data: 'a'}, { name: 'two tab', data: 'b' }];
    const newTabs = [{ name: 'one tab', data: 'a'}, { name: 'two tab', data: 'b' }, { name: tabName, data: '' }];

    beforeEach(() => {
        click$ = new Subject();
        tabs$ = new BehaviorSubject(originalTabs);
        selection$ = new BehaviorSubject(0);

        const button = RenameTabButton({
            DOM: mockDOMSource({
                ':root': {
                    'click': click$
                }
            }),
            props$: Observable.of({ tabName }),
            tabs$,
            selection$,
        });
    });

    describe('tabs$', () => {
        it('maintains the initial set of tabs', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            const tabs = callback.lastEvent();
            expect(tabs).to.eql(originalTabs);
        });

        it('adds a new tab when clicked', () => {
            const callback = StreamCallback();
            tabs$.subscribe(callback);

            click$.onNext();

            const tabs = callback.lastEvent();
            expect(tabs).to.eql(newTabs);
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