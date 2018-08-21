function ReactDOMTextComponent(text) {
  this._currentElement = '' + text
  this._rootId = null
}

ReactDOMTextComponent.prototype.mountComponent = (rootID) => {
  this._rootId = rootID
  return '<span data-reactid="' + rootID + '">' + this._currentElement + '</span>'
}

function ReactDOMComponent(element) {
  this._currentElement = element
  this._rootId = null
}

ReactDOMComponent.prototype.mountComponent = (rootID) => {
  this._rootId = rootID
  let props = this._currentElement.props,
      tagOpen = '<' + this._currentElement.type + ' data-reactid="' + rootID + '"',
      tagClose = '<' + this._currentElement.type + '>'
  for(let key in props) {
    if (props[key] && key !== 'children' && !/^on[A-Za-z]/.text(key)) {
      tagOpen += ' ' + key + '="' + props[key] + '"'
    }
  }
  let content = '', children = props.children|| []
  let childrenInstances = []
  children.forEach((child, index) => {
    let childComponentInstance = instantiateReactComponent(child)
    childrenInstances.push(childComponentInstance)
    const rootID = this._rootId + '.' + index
    const childMarkup = childComponentInstance.mountComponent(rootID)
    content = ' ' + childMarkup
  })
  this._renderedChildren = childrenInstances
  return tagOpen + '>' + content + tagClose
}

function ReactCompositeComponent(element) {
  this._currentElement = element
  this._rootId = null
}
ReactCompositeComponent.prototype.mountComponent = (rootID) => {
  this._rootId = rootID
  let props = this._currentElement.props,
      type = this._currentElement.type
  
}


function instantiateReactComponent(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    // 文本节点
    return new ReactDOMTextComponent(node)
  } else if (typeof node === 'object' && typeof node.type === 'string') {
    // 浏览器默认节点
    return new ReactDOMComponent(node)
  } else if (typeof node === 'object' && typeof node.type === 'function') {
    // 自定义的元素节点
    return new ReactCompositeComponent(node)
  }
}

export default instantiateReactComponent