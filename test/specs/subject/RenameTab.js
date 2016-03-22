import chai, {expect} from 'chai';
import setup from '../../helpers/setup';
import StreamCallback from '../../helpers/StreamCallback';
import RenameTab from '../../../src/subject/RenameTab';
import {Subject} from 'rx';

describe('RenameTab', () => {
    setup();

    let driver$, tabs$, selection$;

    const firstTab = { name: 'one tab', data: 'a' };
    const secondTab = { name: 'two tab', data: 'b' };
    const thirdTab = { name: 'three tab', data: 'c' };

    beforeEach(() => {
        driver$ = new Subject();
        tabs$ = new Subject();
        selection$ = new Subject();

        const subject = RenameTab({ tabs$, selection$ });
        driver$.subscribe(subject);
    });

    describe('tabs$', () => {
        describe('initialise', () => {
            it('does nothing with no tabs and no selection', () => {
                const spy = chai.spy();
                tabs$.subscribe(spy);

                expect(spy).not.to.be.called();
            });

            it('does nothing with no tabs', () => {
                const spy = chai.spy();
                tabs$.subscribe(spy);

                selection$.onNext(0);

                expect(spy).not.to.be.called();
            });

            it('does nothing with no selection', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([]);

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([]);
            });

            it('does nothing with an empty set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([]);
                selection$.onNext(-1);

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([]);
            });

            it('does nothing with a populated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(0);

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, secondTab]);
            });

            it('does nothing with an updated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(0);
                tabs$.onNext([firstTab, secondTab, thirdTab]);

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, secondTab, thirdTab]);
            });

            it('does nothing with an updated selection', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(0);
                selection$.onNext(1);

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, secondTab]);
            });
        });

        describe('renaming', () => {
            it('renames the first tab from a populated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab, thirdTab]);
                selection$.onNext(0);
                driver$.onNext('first new name');

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([{ name: 'first new name', data: 'a' }, secondTab, thirdTab]);
            });

            it('renames the middle tab from a populated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab, thirdTab]);
                selection$.onNext(1);
                driver$.onNext('second new name');

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, { name: 'second new name', data: 'b' }, thirdTab]);
            });

            it('renames the last tab from a populated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab, thirdTab]);
                selection$.onNext(2);
                driver$.onNext('third new name');

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, secondTab, { name: 'third new name', data: 'c' }]);
            });

            it('renames the first tab from an updated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(0);
                tabs$.onNext([firstTab, secondTab, thirdTab]);
                driver$.onNext('new name one');

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([{ name: 'new name one', data: 'a' }, secondTab, thirdTab]);
            });

            it('renames the middle tab from an updated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(1);
                tabs$.onNext([firstTab, secondTab, thirdTab]);
                driver$.onNext('new name two');

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, { name: 'new name two', data: 'b' }, thirdTab]);
            });

            it('renames the last tab from an updated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(1);
                tabs$.onNext([firstTab, secondTab, thirdTab]);
                selection$.onNext(2);
                driver$.onNext('new name three');

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, secondTab, { name: 'new name three', data: 'c' }]);
            });

            describe('invalid state', () => {
                it('has no effect with no tabs and no selection', () => {
                    const spy = chai.spy();
                    tabs$.subscribe(spy);

                    driver$.onNext();

                    expect(spy).not.to.be.called();
                });

                it('has no effect with no tabs', () => {
                    const spy = chai.spy();
                    tabs$.subscribe(spy);

                    selection$.onNext(0);
                    driver$.onNext();

                    expect(spy).not.to.be.called();
                });

                it('has no effect with no selection', () => {
                    const callback = StreamCallback();
                    tabs$.subscribe(callback);

                    tabs$.onNext([]);
                    driver$.onNext();

                    const tabs = callback.lastEvent();
                    expect(tabs).to.eql([]);
                });

                it('has no effect with an empty set of tabs', () => {
                    const callback = StreamCallback();
                    tabs$.subscribe(callback);

                    tabs$.onNext([]);
                    selection$.onNext(-1);
                    driver$.onNext();

                    const tabs = callback.lastEvent();
                    expect(tabs).to.eql([]);
                });

                it('has no effect with an empty selection', () => {
                    const callback = StreamCallback();
                    tabs$.subscribe(callback);

                    tabs$.onNext([firstTab, secondTab]);
                    selection$.onNext(-1);
                    driver$.onNext();

                    const tabs = callback.lastEvent();
                    expect(tabs).to.eql([firstTab, secondTab]);
                });

                it('has no effect with an invalid selection', () => {
                    const callback = StreamCallback();
                    tabs$.subscribe(callback);

                    tabs$.onNext([firstTab, secondTab]);
                    selection$.onNext(2);
                    driver$.onNext();

                    const tabs = callback.lastEvent();
                    expect(tabs).to.eql([firstTab, secondTab]);
                });
            });
        });
    });
});