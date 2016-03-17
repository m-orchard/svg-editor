import jsdom from 'mocha-jsdom';
import chai from 'chai';
import spies from 'chai-spies';
import vdom from 'chai-virtual-dom';

export default () => {
    jsdom();
    chai.use(spies);
    chai.use(vdom);
}