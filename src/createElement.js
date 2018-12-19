import { ReactElement } from './vdom/ReactElement.js'

export function createElement (type, config, children) {
  var props = {}
  var key = config.key || null
  for (propName in config) {
    if (config.hasOwnProperty(propName) && propName !== 'key') {
      props[propName] = config[propName]
    }
  }
  var childrenLen = arguments.length - 2
  if (childrenLen === 1) {
    props.children = Array.isArray(children) ? children : [children]
  } else if (childrenLen > 1) {
    var childrenArr = []
    for (var i = 0; i < childrenLen; i++) {
      childrenArr[i] = arguments[i + 2]
    }
    props.children = childrenArr
  }
  return new ReactElement(type, key, props)
}