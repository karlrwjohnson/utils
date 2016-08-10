/**
 * A poor man's UI library
 * For when you want to work with the raw DOM
 */
const dom = (function() {

  function domFactoryFactory (elementName) {
    return function domFactory (...args) {
      const element = document.createElement(elementName);
      for (let arg of args) {
        if (arg instanceof HTMLElement) {
          element.appendChild(arg);
        }
        else if (typeof arg === 'object') {
          for (let attr in arg) {

            // event handlers
            if (typeof arg[attr] === 'function' && attr.startsWith('on')) {
              element[attr] = arg[attr];
            }
            // other properties
            else {
              element.setAttribute(attr, arg[attr]);
            }
          }
        }
        else if (typeof arg === 'string') {
          element.appendChild(document.createTextNode(arg));
        }
        else {
          throw Error(`Unknown argument type ${arg}`)
        }
      }
      return element;
    }
  }

  return {
    /**
     * Function which create DOM elements with corresponding tag names
     * and initializes them with certain properties
     * Arguments may be accepted in any order:
     * - HTMLElement - the element is appended to the object in that position
     * - String - A text node is created and appended to the object
     * - Object - Properties of the object are assigned to the element
     *    * type is Function and name starts with "on" - Added as an event callback
     *    * Otherwise, assigned through setAttribute()
     */
    a        : domFactoryFactory('a'),
    aside    : domFactoryFactory('aside'),
    b        : domFactoryFactory('b'),
    button   : domFactoryFactory('button'),
    canvas   : domFactoryFactory('canvas'),
    col      : domFactoryFactory('col'),
    colgroup : domFactoryFactory('colgroup'),
    div      : domFactoryFactory('div'),
    form     : domFactoryFactory('form'),
    h1       : domFactoryFactory('h1'),
    h2       : domFactoryFactory('h2'),
    h3       : domFactoryFactory('h3'),
    h4       : domFactoryFactory('h4'),
    h5       : domFactoryFactory('h5'),
    h6       : domFactoryFactory('h6'),
    h7       : domFactoryFactory('h7'),
    header   : domFactoryFactory('header'),
    hr       : domFactoryFactory('hr'),
    i        : domFactoryFactory('i'),
    img      : domFactoryFactory('img'),
    input    : domFactoryFactory('input'),
    li       : domFactoryFactory('li'),
    main     : domFactoryFactory('main'),
    nav      : domFactoryFactory('nav'),
    ol       : domFactoryFactory('ol'),
    option   : domFactoryFactory('option'),
    p        : domFactoryFactory('p'),
    select   : domFactoryFactory('select'),
    span     : domFactoryFactory('span'),
    table    : domFactoryFactory('table'),
    tbody    : domFactoryFactory('tbody'),
    td       : domFactoryFactory('td'),
    textarea : domFactoryFactory('textarea'),
    th       : domFactoryFactory('th'),
    thead    : domFactoryFactory('thead'),
    tfoot    : domFactoryFactory('tfoot'),
    tr       : domFactoryFactory('tr'),
    ul       : domFactoryFactory('ul'),

    /** Remove all children from a parent element **/
    removeChildren (element) {
      for (let i of Array.from(element.childNodes)) {
        element.removeChild(i);
      }
    },

    insertChildAtIndex (parent, index, child) {
      // "|| null" converts undefineds to nulls.
      // Node.insertBefore() interprets null nextSiblings as "append at the end"
      const nextSibling = parent.children[index] || null;
      return parent.insertBefore(child, nextSibling);
    },

    removeChildAtIndex (parent, index) {
      return parent.removeChild(parent.children[index]);
    },

    getIndexOfElementInParent(element) {
      return Array.prototype.indexOf.call(element.parentElement.children,
          element);
    },
  };
})();

if (typeof(module) === 'object') {
  module.exports = dom;
}
