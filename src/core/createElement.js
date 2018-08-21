import ReactElement from '../../vdom/ReactElement.js'

/**
 * @param {string|function|Component} type
 * @param {object} config
 * @param {array} children
 * @returns
 */

function createElement(type, config, ...children) {
  let props = {}, propName, config = config || {}, key = config.key || null
  for(propName in config) {
    if (config.hasOwnProperty(propName) && propName !== 'key') {
      props[propName] = config[propName]
    }
  }

  var childrenLen = arguments.length - 2
  if (childrenLen > 0) {
    props.children = children
  }
  return new ReactElement(type, key, props)
}

export default createElement