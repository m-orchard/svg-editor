import Tabs from './Tabs';
import Input from './Input';
import Button from './Button';
import AddTab from './subject/AddTab';
import RemoveTab from './subject/RemoveTab';
import RenameTabButton from './RenameTabButton';
import SVGRenderer from './SVGRenderer';
import storage from './storage';
import {Observable, BehaviorSubject} from 'rx';
import {run} from '@cycle/core';
import {makeDOMDriver, div} from '@cycle/dom';

const initialSVGs = [
    { name: 'svg 1', data: '<rect x="5" y="15" height="10" width="10" fill="orange"/>' },
    { name: 'svg 2', data: '<rect x="20" y="25" height="15" width="10" fill="red"/>' }
];
const initialSelection = 0;

function main(sources) {
    const storedData = storage.get('svg-data');
    const selection$ = new BehaviorSubject(storedData ? storedData.selection : initialSelection);
    const svgs$ = new BehaviorSubject(storedData ? storedData.svgs : initialSVGs);
    const names$ = svgs$.map(svgs => svgs.map(({ name }) => name));
    const state$ = Observable.combineLatest(svgs$, selection$, (svgs, selection) => ({ svgs, selection }));
    const validSelection$ = state$.map(({ svgs, selection }) => (0 <= selection && selection < svgs.length));
    const currentData$ = state$.withLatestFrom(validSelection$, ({ svgs, selection }, validSelection) => (validSelection ? svgs[selection].data : ''));

    state$.subscribe(state => {
        storage.set('svg-data', state);
    });

    const DOM = sources.DOM;
    const tabs = Tabs({ DOM, names$, selection$ });

    const addTabButton = Button({ DOM, props$: Observable.of({ label: '+' }) });
    addTabButton.click$.subscribe(AddTab({ tabs$: svgs$, selection$, name$: Observable.of('svg') }));

    const removeTabButton = Button({ DOM, props$: Observable.of({ label: '-' }) });
    removeTabButton.click$.subscribe(RemoveTab({ tabs$: svgs$, selection$ }));

    const renameTabButton = RenameTabButton({ DOM, tabs$: svgs$, selection$ });
    const svgInput = Input({ DOM, data$: currentData$, enabled$: validSelection$, type$: Observable.of('textarea') });
    const svgRenderer = SVGRenderer({ value$: svgInput.value$ });

    const newSVGs$ = svgInput.input$.withLatestFrom(svgs$, selection$, (value, svgs, selection) => {
        const newSVGs = svgs.slice();
        newSVGs[selection] = { name: newSVGs[selection].name, data: value };
        return newSVGs;
    });
    newSVGs$.subscribe(svgs$);

    const vleftControls$ = Observable.combineLatest(tabs.DOM, addTabButton.DOM, (vtabs, vaddTabButton) => div('.controls.left-controls', [vtabs, vaddTabButton]));
    const vrightControls$ = Observable.combineLatest(renameTabButton.DOM, removeTabButton.DOM, (vrenameTabButton, vremoveTabButton) => div('.controls.right-controls', [vrenameTabButton, vremoveTabButton]));
    const vcontrols$ = Observable.combineLatest(vleftControls$, vrightControls$, (vleftControls, vrightControls) => div('.controls', [vleftControls, vrightControls]));
    const veditor$ = Observable.combineLatest(svgInput.DOM, svgRenderer.DOM, (vinput, vrenderer) => div('.svg-editor', [vinput, vrenderer]));
    const vapp$ = Observable.combineLatest(vcontrols$, veditor$, (vcontrols, veditor) => div('.app', [vcontrols, veditor]));

    return {
        DOM: vapp$
    };
}

run(main, {
    DOM: makeDOMDriver('body')
});