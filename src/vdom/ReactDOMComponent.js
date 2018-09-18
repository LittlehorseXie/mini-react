function ReactDOMComponent (element) {
  this._currentElement = element
  this._rootNodeId = null
}
ReactDOMComponent.prototype.mountComponent = function (rootId) {
  this._rootNodeId = rootId

  let openTag = '<' + this._currentElement.type
  let closeTag = '</' + this._currentElement.type + '>'

  // 添加react id属性
  openTag += ' data-reactid=' + this._rootNodeId

  // 添加普通dom属性
  let props = this._currentElement.props
  Object.keys(props).forEach(key => {
    if(/^on[A-Za-z]/.test(key)) {
      // 处理事件
      const eventType = key.replace('on', '')

    } else if(key !== 'children') {
      // 处理除了事件、children之外的普通属性
      openTag += ' ' + key + '=' + props[key]
    }
  })

  // 获取子节点渲染出的内容
  let content = ''
  let children = props.children || []
  // 用于保存所有的子节点的Componet实例，以后会用到
  let childrenInstances = []

  children.forEach((child, index) => {
    const childComponentInstance = instantiateReactComponent(child)
    // childrenInstances.push(childComponentInstance)
    // 子节点的rootId是父节点的rootId加上index的值拼成的新值
    const childRootId = this._rootNodeId + '.' + index
    const childMarkUp =  childComponentInstance.mountComponent(childRootId)
    content += ' ' + childMarkUp
  })

  return openTag + '>' + content + closeTag
}

export default ReactDOMComponent