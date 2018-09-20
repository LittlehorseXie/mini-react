/**
 * 
 * @param {ReactElement} element
 * 
 * @property {ReactElement} _currentElement
 * @property {string} _rootNodeId
 * @property {ReactClass} _instance
 * @property {ReactDOMTextComponent || ReactDOMComponent || ReactCompositeComponent} _renderedComponent
 * 
 * @method mountComponent 
 *    React.render时调用
 *    调用componentWillMount 和 componentDidMount生命周期函数
 *    返回render函数内的元素 markup后 拼接好的DOM串
 * @method receiveComponent 
 *    setState时调用
 *    调用componentWillUpdate 和 componentDidUpdate生命周期函数
 *    接收两个参数 nextElement 和 nextState
 *    当调用setState时，nextElement = null，传入nextState，更新_instance的state
 */

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
    if (prevType === 'string' || prevType === 'number') {
      return nextType === 'string' || nextType === 'number'
    } else {
      return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key
    }
  }
  return false
}

export default ReactCompositeComponent