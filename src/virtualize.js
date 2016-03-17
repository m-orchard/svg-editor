import DOMPurify from 'dompurify';
import VNode from 'virtual-dom/vnode/vnode';
import VText from 'virtual-dom/vnode/vtext';
import converterFactory from 'html-to-vdom';

const converter = converterFactory({ VNode, VText });
const svgNamespace = 'http://www.w3.org/2000/svg';

function sanitizeSVGNode(node) {
    node.namespace = svgNamespace;
    if(node.children) {
        sanitizeSVG(node.children);
    }
    return node;
}

export function sanitizeSVG(nodes) {
    if(!Array.isArray(nodes)) {
        sanitizeSVGNode(nodes);
    } else {
        nodes.forEach(sanitizeSVGNode);
    }
    return nodes;
}

export function fromString(html) {
    try {
        return converter(DOMPurify.sanitize(html));
    } catch(e) {
        return [];
    }
}