import {fromHTML} from 'vdom-virtualize';

const svgNamespace = 'http://www.w3.org/2000/svg';

export function sanitizeSVGNode(node) {
    node.tagName = node.tagName.toLowerCase();
    node.namespace = svgNamespace;
    if(node.children) {
        sanitizeSVGNodes(node.children);
    }
    return node;
}

export function sanitizeSVGNodes(nodes) {
    for(let i = 0; i < nodes.length; i++) {
        sanitizeSVGNode(nodes[i]);
    }
    return nodes;
}

export function fromString(html) {
    const document = fromHTML(html);
    const elements = document.children[1].children;
    return elements;
}