import chai, {expect} from 'chai';
import setup from '../../helpers/setup';
import StreamCallback from '../../helpers/StreamCallback';
import AddTab from '../../../src/subject/AddTab';
import {Subject} from 'rx';

describe('AddTab', () => {
    setup();

    let driver$, tabs$, name$, selection$;

    const newTab = { name: 'tab', data: '' };
    const altNewTab = { name: 'alt tab', data: '' };
    const firstTab = { name: 'one tab', data: 'a' };
    const secondTab = { name: 'two tab', data: 'b' };
    const newTabAlt = { name: 'alt tab', data: '' };

    beforeEach(() => {
        driver$ = new Subject();
        tabs$ = new Subject();
        name$ = new Subject();
        selection$ = new Subject();

        const subject = AddTab({ tabs$, name$, selection$ });
        driver$.subscribe(subject);
    });

    describe('tabs$', () => {
        describe('initialise', () => {
            it('does nothing with no tabs and no name', () => {
                const spy = chai.spy();
                tabs$.subscribe(spy);

                expect(spy).not.to.be.called();
            });

            it('does nothing with no tabs', () => {
                const spy = chai.spy();
                tabs$.subscribe(spy);

                name$.onNext('tab');

                expect(spy).not.to.be.called();
            });

            it('does nothing with no name', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([]);

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([]);
            });

            it('does nothing with an empty set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([]);

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([]);
            });

            it('does nothing with a populated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, secondTab]);
            });

            it('does nothing with an updated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);
                tabs$.onNext([firstTab]);

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab]);
            });

            it('does nothing with an updated name', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);
                name$.onNext('alt tab');

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, secondTab]);
            });
        });

        describe('adding', () => {
            it('adds a tab to an empty set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([]);
                driver$.onNext();

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([newTab]);
            });

            it('adds a tab to a populated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);
                driver$.onNext();

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, secondTab, newTab]);
            });

            it('adds a tab to an updated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);
                tabs$.onNext([firstTab]);
                driver$.onNext();

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, newTab]);
            });

            it('adds a tab with an updated name', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);
                name$.onNext('alt tab');
                driver$.onNext();

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, secondTab, altNewTab]);
            });

            describe('invalid state', () => {
                it('has no effect with no tabs and no name', () => {
                    const spy = chai.spy();
                    tabs$.subscribe(spy);

                    driver$.onNext();

                    expect(spy).not.to.be.called();
                });

                it('has no effect with no tabs', () => {
                    const spy = chai.spy();
                    tabs$.subscribe(spy);

                    name$.onNext('tab');
                    driver$.onNext();

                    expect(spy).not.to.be.called();
                });

                it('has no effect with no name', () => {
                    const callback = StreamCallback();
                    tabs$.subscribe(callback);

                    tabs$.onNext([]);
                    driver$.onNext();

                    const tabs = callback.lastEvent();
                    expect(tabs).to.eql([]);
                });
            });
        });
    });

    describe('selection$', () => {
        describe('initialise', () => {
            it('does nothing with no tabs and no name', () => {
                const spy = chai.spy();
                selection$.subscribe(spy);

                expect(spy).not.to.be.called();
            });

            it('does nothing with no tabs', () => {
                const spy = chai.spy();
                selection$.subscribe(spy);

                name$.onNext('tab');

                expect(spy).not.to.be.called();
            });

            it('does nothing with no name', () => {
                const spy = chai.spy();
                selection$.subscribe(spy);

                tabs$.onNext([]);

                expect(spy).not.to.be.called();
            });

            it('does nothing with an empty set of tabs', () => {
                const spy = chai.spy();
                selection$.subscribe(spy);

                name$.onNext('tab');
                tabs$.onNext([]);

                expect(spy).not.to.be.called();
            });

            it('does nothing with a populated set of tabs', () => {
                const spy = chai.spy();
                selection$.subscribe(spy);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);

                expect(spy).not.to.be.called();
            });

            it('does nothing with an updated set of tabs', () => {
                const spy = chai.spy();
                selection$.subscribe(spy);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);
                tabs$.onNext([firstTab]);

                expect(spy).not.to.be.called();
            });

            it('does nothing with an updated selection', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(0);
                selection$.onNext(1);

                const selection = callback.lastEvent();
                expect(selection).to.equal(1);
            });
        });

        describe('adding', () => {
            it('selects the last tab added to a set of empty tabs', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([]);
                driver$.onNext();

                const selection = callback.lastEvent();
                expect(selection).to.equal(0);
            });

            it('selects the last tab added to a populated set of tabs', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);
                driver$.onNext();

                const selection = callback.lastEvent();
                expect(selection).to.equal(2);
            });

            it('selects the last tab added to an updated set of tabs', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);
                tabs$.onNext([firstTab]);
                driver$.onNext();

                const selection = callback.lastEvent();
                expect(selection).to.equal(1);
            });

            it('overrides an updated selection when a tab is added', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                name$.onNext('tab');
                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(1);
                driver$.onNext();

                const selection = callback.lastEvent();
                expect(selection).to.equal(2);
            });

            describe('invalid state', () => {
                it('has no effect with no tabs and no name', () => {
                    const spy = chai.spy();
                    selection$.subscribe(spy);

                    driver$.onNext();

                    expect(spy).not.to.be.called();
                });

                it('has no effect with no tabs', () => {
                    const spy = chai.spy();
                    selection$.subscribe(spy);

                    name$.onNext('tab');
                    driver$.onNext();

                    expect(spy).not.to.be.called();
                });

                it('has no effect with no name', () => {
                    const spy = chai.spy();
                    selection$.subscribe(spy);

                    tabs$.onNext([]);
                    driver$.onNext();

                    expect(spy).not.to.be.called();
                });
            });
        });
    });
});