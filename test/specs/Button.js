import chai from 'chai';
import setup from '../helpers/setup';
import StreamCallback from '../helpers/StreamCallback';
import Button from '../../src/Button';
import {mockDOMSource} from '@cycle/dom';
import {Observable, Subject} from 'rx';

describe('Button', () => {
    setup();
    const expect = chai.expect;

    const label = 'Click Me!';
    let button, props$, click$;

    beforeEach(() => {
        click$ = new Subject();
        props$ = new Observable.of({ label: label });

        button = Button({
            DOM: mockDOMSource({
                ':root': {
                    'click': click$
                }
            }),
            props$: props$
        });
    });

    describe('DOM', () => {
        it('renders a label', () => {
            const callback = StreamCallback();
            button.DOM.subscribe(callback);

            const vtree = callback.lastEvent();
            expect(vtree.tagName).to.equal('DIV');
            expect(vtree.children[0].text).to.equal(label);
        });
    });

    describe('click$', () => {
        it('forwards a click', () => {
            const spy = chai.spy(() => {});
            button.click$.subscribe(spy);

            click$.onNext();

            expect(spy).to.be.called();
        });
    });
});