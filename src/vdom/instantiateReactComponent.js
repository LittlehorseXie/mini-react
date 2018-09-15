
function ReactDOMTextComponent (element) {
  this._currentElement = element
  this._rootNodeId = null
}
ReactDOMTextComponent.prototype.mountComponent = function (rootId) {
  this._rootNodeId = rootId
}

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

function ReactCompositeComponent (element) {
  this._currentElement = element
  this._rootNodeId = null
  // 保存自定义Component的实例，包含render函数等
  this._instance = null
  // 保存Component里render的Dom实例，由instantiateReactComponent生成
  this._renderedComponent = null
}
ReactCompositeComponent.prototype.mountComponent = function (rootId) {
  this._rootNodeId = rootId

  const props = this._currentElement.props
  const ReactClass = this._currentElement.type
  // 生成一个Component的实例
  const component = new ReactClass(props)
  this._instance = component
  component._reactInternalInstance = this

  // 调用生命周期函数 -- componentWillMount
  if (component.componentWillMount) {
    component.componentWillMount()
  }

  const renderedElement = this._instance.render()
  const renderedComponentInstance = instantiateReactComponent(renderedElement)
  // 保存Component里render的Dom实例
  this._renderedComponent = renderedComponentInstance
  const renderedMarkup = renderedComponentInstance.mountComponent(this._rootNodeID)

  // 监听render函数的渲染完毕事件
  // 调用生命周期函数 -- componentDidMount
  $(document).on('mountReady', function() {
    component.componentDidMount && component.componentDidMount()
  })

  return renderedMarkup
}
ReactCompositeComponent.prototype.receiveComponent = function (nextElement, nextState) {
  this._currentElement = nextElement || this._currentElement
  const inst = this._instance
  inst.state = Object.assign({}, inst.state, nextState)

  const nextProps = this._currentElement.props

  // 当声明了shouldComponentUpdate且返回false时，说明不需要更新，直接返回即可
  if (inst.shouldComponentUpdate && inst.shouldComponentUpdate(nextProps, nextState) === false) return

  // 调用生命周期函数 -- componentWillUpdate
  if (inst.componentWillUpdate) inst.componentWillUpdate(nextProps, nextState)

  var prevComponentInstance = this._renderedComponent
  var prevRenderedElement = prevComponentInstance._currentElement
  // 重新执行render拿到对应的新element
  const nextRenderedElement = this._instance.render()

  // 判断组件要局部更新还是重新渲染
  if (_shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
    // 如果需要更新


    // 调用生命周期函数 -- componentDidUpdate
    inst.componentDidUpdate && inst.componentDidUpdate()
  } else {
    // 如果发现完全是不同的两种element，那就干脆重新渲染了
    const thisID = this._rootNodeID
    this._renderedComponent = nextRenderedElement
    const nextMarkup = nextRenderedElement.mountComponent(thisID)
    $('[data-reactid="' + this._rootNodeID + '"]').replaceWith(nextMarkup)
  }

}

// 用来判定两个element需不需要更新，返回false时需要重新渲染
function _shouldUpdateReactComponent (prevElement, nextElement) {
  if (prevElement && nextElement) {
    const prevType = prevElement.type
    const nextType = nextElement.type

  }
  return false
}

// 不管什么节点，都生成一个Component示例
// 自定义组件生命周期处理
// componentWillMount   在 mountComponent 里处理
// componentDidMount    在 mountComponent 里处理
// componentWillUpdate  在 receiveComponent 里处理
/**
 * @param {ReactElement} element 
 */
export default instantiateReactComponent = function (element) {
  // 文本节点
  if (typeof element === 'string' || typeof element === 'number') {
    return new ReactDOMTextComponent(element)
  }
  // 浏览器默认节点
  if (typeof element === 'object' && typeof element.type === 'string') {
    return new ReactDOMComponent(element)
  }
  // 自定义节点
  if (typeof element === 'object' && typeof element.type === 'function') {
    return new ReactCompositeComponent(element)
  }
}