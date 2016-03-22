import chai, {expect} from 'chai';
import setup from '../../helpers/setup';
import StreamCallback from '../../helpers/StreamCallback';
import Button from '../../../src/component/Button';
import {div, mockDOMSource} from '@cycle/dom';
import {Observable, Subject} from 'rx';

describe('Button', () => {
    setup();

    let button, click$;

    const label = 'Click Me!';
    const vbutton = div('.button', [label]);

    beforeEach(() => {
        click$ = new Subject();

        button = Button({
            DOM: mockDOMSource({
                ':root': {
                    'click': click$
                }
            }),
            props$: Observable.of({ label })
        });
    });

    describe('DOM', () => {
        it('renders a label', () => {
            const callback = StreamCallback();
            button.DOM.subscribe(callback);

            const vtree = callback.lastEvent();
            expect(vtree).to.look.like(vbutton);
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