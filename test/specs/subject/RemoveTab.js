import chai, {expect} from 'chai';
import setup from '../../helpers/setup';
import StreamCallback from '../../helpers/StreamCallback';
import RemoveTab from '../../../src/subject/RemoveTab';
import {Subject} from 'rx';

describe('RemoveTab', () => {
    setup();

    let driver$, tabs$, selection$;

    const firstTab = { name: 'one tab', data: 'a' };
    const secondTab = { name: 'two tab', data: 'b' };
    const thirdTab = { name: 'three tab', data: 'c' };

    beforeEach(() => {
        driver$ = new Subject();
        tabs$ = new Subject();
        selection$ = new Subject();

        const subject = RemoveTab({ tabs$, selection$ });
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

        describe('removing', () => {
            it('removes the first tab from a populated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab, thirdTab]);
                selection$.onNext(0);
                driver$.onNext();

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([secondTab, thirdTab]);
            });

            it('removes the middle tab from a populated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab, thirdTab]);
                selection$.onNext(1);
                driver$.onNext();

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, thirdTab]);
            });

            it('removes the last tab from a populated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab, thirdTab]);
                selection$.onNext(2);
                driver$.onNext();

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, secondTab]);
            });

            it('removes the first tab from an updated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(0);
                tabs$.onNext([firstTab, secondTab, thirdTab]);
                driver$.onNext();

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([secondTab, thirdTab]);
            });

            it('removes the middle tab from an updated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(1);
                tabs$.onNext([firstTab, secondTab, thirdTab]);
                driver$.onNext();

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, thirdTab]);
            });

            it('removes the last tab from an updated set of tabs', () => {
                const callback = StreamCallback();
                tabs$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(1);
                tabs$.onNext([firstTab, secondTab, thirdTab]);
                selection$.onNext(2);
                driver$.onNext();

                const tabs = callback.lastEvent();
                expect(tabs).to.eql([firstTab, secondTab]);
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

    describe('selection$', () => {
        describe('initialise', () => {
            it('does nothing with no tabs and no selection', () => {
                const spy = chai.spy();
                selection$.subscribe(spy);

                expect(spy).not.to.be.called();
            });

            it('does nothing with no tabs', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                selection$.onNext(0);

                const selection = callback.lastEvent();
                expect(selection).to.equal(0);
            });

            it('does nothing with no selection', () => {
                const spy = chai.spy();
                selection$.subscribe(spy);

                tabs$.onNext([]);

                expect(spy).not.to.be.called();
            });

            it('does nothing with an empty set of tabs', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                tabs$.onNext([]);
                selection$.onNext(-1);

                const selection = callback.lastEvent();
                expect(selection).to.equal(-1);
            });

            it('does nothing with a populated set of tabs', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(0);

                const selection = callback.lastEvent();
                expect(selection).to.equal(0);
            });

            it('does nothing with an updated set of tabs', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(0);
                tabs$.onNext([firstTab, secondTab, thirdTab]);

                const selection = callback.lastEvent();
                expect(selection).to.equal(0);
            });

            it('does nothing with an updated selection', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(0);
                selection$.onNext(1);

                const selection = callback.lastEvent();
                expect(selection).to.equal(1);
            });
        });

        describe('removing', () => {
            it('selects the same index when removing from before the end of a populated set of tabs', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab, thirdTab]);
                selection$.onNext(1);
                driver$.onNext();

                const selection = callback.lastEvent();
                expect(selection).to.equal(1);
            });

            it('selects the new last tab when removing the end from a populated set of tabs', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                tabs$.onNext([firstTab, secondTab]);
                selection$.onNext(1);
                driver$.onNext();

                const selection = callback.lastEvent();
                expect(selection).to.equal(0);
            });

            it('clears the selection when removing the last tab', () => {
                const callback = StreamCallback();
                selection$.subscribe(callback);

                tabs$.onNext([firstTab]);
                selection$.onNext(0);
                driver$.onNext();

                const selection = callback.lastEvent();
                expect(selection).to.equal(-1);
            });

            describe('invalid state', () => {
                it('has no effect with no tabs and no selection', () => {
                    const spy = chai.spy();
                    selection$.subscribe(spy);

                    driver$.onNext();

                    expect(spy).not.to.be.called();
                });

                it('has no effect with no tabs', () => {
                    const callback = StreamCallback();
                    selection$.subscribe(callback);

                    selection$.onNext(0);
                    driver$.onNext();

                    const selection = callback.lastEvent();
                    expect(selection).to.equal(0);
                });

                it('has no effect with no selection', () => {
                    const spy = chai.spy();
                    selection$.subscribe(spy);

                    tabs$.onNext([]);
                    driver$.onNext();

                    expect(spy).not.to.be.called();
                });

                it('has no effect with an empty set of tabs', () => {
                    const callback = StreamCallback();
                    selection$.subscribe(callback);

                    tabs$.onNext([]);
                    selection$.onNext(-1);
                    driver$.onNext();

                    const selection = callback.lastEvent();
                    expect(selection).to.equal(-1);
                });

                it('has no effect on an empty selection', () => {
                    const callback = StreamCallback();
                    selection$.subscribe(callback);

                    tabs$.onNext([firstTab, secondTab]);
                    selection$.onNext(-1);
                    driver$.onNext();

                    const selection = callback.lastEvent();
                    expect(selection).to.equal(-1);
                });

                it('has no effect on an invalid selection', () => {
                    const callback = StreamCallback();
                    selection$.subscribe(callback);

                    tabs$.onNext([firstTab, secondTab]);
                    selection$.onNext(2);
                    driver$.onNext();

                    const selection = callback.lastEvent();
                    expect(selection).to.equal(2);
                });
            });
        });
    });
});