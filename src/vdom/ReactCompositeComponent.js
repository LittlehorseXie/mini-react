import instantiateReactComponent from "./instantiateReactComponent";

export default function ReactCompositeComponent(element) {
  this._currentElement = element
  this._rootNodeID = null
  // 存放 对应的ReactClass 的实例
  this._instance = null
  // 存放 render返回的DOM结构 instantiateReactComponent之后 的实例
  this._renderedComponent = null
}

ReactCompositeComponent.prototype.mountComponent = function(rootID) {
  this._rootNodeID = rootID
  var publicProps = this._currentElement.props
  var ReactClass = this._currentElement.type
  var inst = new ReactClass(publicProps)
  this._instance = inst
  inst._reactInternalInstance = this

  if (inst.componentWillMount) {
    inst.componentWillMount()
  }

  var renderedElement = inst.render()
  var renderedComponentInstance = instantiateReactComponent(renderedElement)
  this._renderedComponent = renderedComponentInstance
  var renderedMarkup = renderedComponentInstance.mountComponent(this._rootNodeID)

  $(document).on('mountReady', function() {
    //调用inst.componentDidMount
    inst.componentDidMount && inst.componentDidMount()
  })
  
  return renderedMarkup
}

ReactCompositeComponent.prototype.receiveComponent = function(nextElement, nextState) {
  this._currentElement = nextElement || this._currentElement
  var inst = this._instance
  var nextState = Object.assign({}, inst.state, nextState)
  var nextProps = this._currentElement.props

  inst.state = nextState

  if (inst.shouldComponentUpdata && (inst.shouldComponentUpdata(nextProps, nextState) === false)) {
    return
  }
  inst.shouldComponentUpdata && inst.shouldComponentUpdata(nextProps, nextState)

  var prevRenderedElement = this._renderedComponent._currentElement
  var nextRenderedElement = inst.render()

  // _shouldUpdateReactComponent为全局函数，用来对比新旧Element
  if (_shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
    prevRenderedElement.receiveComponent(nextRenderedElement)
    inst.componentDidUpdate && inst.componentDidUpdate()
  } else {
    this._renderedComponent = instantiateReactComponent(nextRenderedElement)
    var nextMarkUp = this._renderedComponent.mountComponent(this._rootNodeID)
    $('[data-reactid=]' + this.rootID).replace = nextMarkUp
  }
}

var _shouldUpdateReactComponent = function (prevElement, nextElement) {
  if (prevRenderedElement && nextRenderedElement) {
    var prevType = typeof prevElement
    var nextType = typeof nextElement
    if (prevType === 'string' || prevType === 'number') {
      return nextType === 'string' || nextType === 'number'
    } else {
      return typeof nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key
    }
  }
  return false
}