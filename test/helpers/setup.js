import jsdom from 'mocha-jsdom';
import chai from 'chai';
import spies from 'chai-spies';

export default () => {
    jsdom();
    chai.use(spies);
}