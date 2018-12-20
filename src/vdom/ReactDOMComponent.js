export default function ReactDOMComponent (element) {
  this._currentElement = element
  this._rootNodeID = null
  this._renderedChildren  = []
}
ReactDOMComponent.prototype.mountComponent = function (rootID) {
  this._rootNodeID = rootID
  var props = this._currentElement.props
  var tagOpen = '<' + this._currentElement.type
  var tagClose = '</' + this._currentElement.type + '>'
  tagOpen += ' data-reactid=' + this._rootNodeID
  
  for (let propName in props) {
    // 处理事件监听 -- on开头的属性
    if (/^on[A-Za-z]/.test(propName)) {

    } else if (propName !== 'children') {
      tagOpen += ' ' + propName + '=' + props[propName]
    }
  }
  tagOpen += '>'
  var content = ''
  var children = props.children
  var childrenInstances = []
  children && children.forEach((child, index) => {
    var childInstance = instantiateReactComponent(child)
    childInstance._mountIndex = index
    childrenInstances.push(childInstance)
    var childRootId = this._rootNodeID + '.' + index
    var childMarkup = childInstance.mountComponent(childRootId)
    content += childMarkup
  })

  this._renderedChildren = childrenInstances
  return tagOpen + content + tagClose
}
ReactDOMComponent.prototype.receiveComponent = function (nextElement) {
  var prevProps = this._currentElement.props
  var nextProps = nextElement.props
  this._currentElement = nextElement
  // 更新属性
  this._updateDOMProperties(prevProps, nextProps)
  // 更新子节点
  this._updateDOMChildren(nextProps.children)
}
ReactDOMComponent.prototype._updateDOMProperties = function (prevProps, nextProps) {
  var propKey
  for (propKey in prevProps) {
    // nextProps也有的属性 在nextProps的循环时处理
    if (nextProps.hasOwnProperty(propKey) || !prevProps.hasOwnProperty(propKey)) {
      continue
    }
    // 事件属性
    if (/^on[A-Za-z]/.test(propKey)) {
      // 未完成 针对当前节点取消事件监听
      continue
    }
    // nextProps没有的属性 删除
    $('[data-reactid="' + this._rootNodeID + '"]').removeAttr(propKey)
  }
  for (propKey in nextProps) {
    // 事件属性
    if (/^on[A-Za-z]/.test(propKey)) {
      // 未完成 之前有的 先去掉监听
      // prevProps[propKey] && 
      // 未完成 添加新的事件
      continue
    }
    if (propKey === 'children') continue
    // 未完成 其他属性 -- 覆盖旧的、添加新的

  }
}

var updateDepth = 0
var diffQueue = []
ReactDOMComponent.prototype._updateDOMChildren = function (nextChildrenElements) {
  updateDepth++
  this._diff(diffQueue, nextChildrenElements)
  updateDepth--
  if (updateDepth === 0) {
    this._patch(diffQueue)
    diffQueue = []
  }
}

// 普通的children是一个数组，此方法把它转换成一个map,key就是element的key
// 如果是text节点或者element创建时并没有传入key,就直接用在数组里的index标识
function flattenChildren(componentChildren) {
  var childrenMap = {}
  componentChildren.forEach((child, index) => {
    var key = child && child._currentElement && child._currentElement.key ? child._currentElement.key : index.toString()
    childrenMap[key] = child
  })
  return childrenMap
}

function generateComponentChildren(prevChildren, nextChildrenElements) {
  var nextChildren = {}
  nextChildrenElements.forEach((child, index) => {
    var key = child.key || index
    var prevChild = prevChildren && prevChildren[key]
    var prevElement = prevChild && prevChild._currentElement
    var nextElement = child
    if (_shouldUpdateReactComponent(prevElement, nextElement)) {
      prevChild.receiveComponent(nextElement)
      nextChildren[key] = prevChild
    } else {
      var nextChildInstance = instantiateReactComponent(nextElement)
      nextChildren[key] = nextChildInstance
    }
  })
  return nextChildren
}

// 差异更新的几种类型
var UPDATE_TYPES = {
  MOVE_EXISTING: 1,   // 没有更改的子节点
  REMOVE_NODE: 2,     // 需要删除的节点
  INSERT_MARKUP: 3    // 新增节点
}

ReactDOMComponent.prototype._diff = function (diffQueue, nextChildrenElements) {
  var self = this
  var prevChildren = flattenChildren(self._renderedChildren)
  var nextChildren = generateComponentChildren(prevChildren, nextChildrenElements)
  self._renderedChildren = []
  Object.keys(nextChildren).forEach(child => {
    self._renderedChildren.push(child)
  })
  var childIndex = 0
  for (key in nextChildren) {
    var prevChild = prevChildren && prevChildren[key]
    var nextChild = nextChildren[key]
    if (prevChild === nextChild) {
      diffQueue.push({
        parentId: self._rootNodeID,
        parentNode: $('[data-reactid=' + self._rootNodeID + ']'),
        type: UPDATE_TYPES.MOVE_EXISTING,
        fromIndex: prevChild._mountIndex,
        toIndex: childIndex
      })
    } else {
      // 如果之前存在，需要push删除类型的节点
      if (prevChild) {
        diffQueue.push({
          parentId: self._rootNodeID,
          parentNode: $('[data-reactid=' + self._rootNodeID + ']'),
          type: UPDATE_TYPES.REMOVE_NODE,
          fromIndex: prevChild._mountIndex,
          toIndex: null
        })
        // 未完成 如果以前已经渲染过了，记得先去掉以前所有的事件监听，通过命名空间全部清空
        if (prevChild._rootNodeID) {
          $(document).undelegate('.' + prevChild._rootNodeID);
        }
      }
      // push新节点
      diffQueue.push({
        parentId: self._rootNodeID,
        parentNode: $('[data-reactid=' + self._rootNodeID + ']'),
        type: UPDATE_TYPES.INSERT_MARKUP,
        fromIndex: null,
        toIndex: childIndex,
        markup: nextChild.mountComponent()
      })
    }
    nextChild._mountIndex = childIndex
    childIndex++
  }

  // 处理新节点里没有，但是旧节点里有的节点
  for (key in prevChildren) {
    if (prevChildren.hasOwnProperty(key) && !(nextChildren && nextChildren.hasOwnProperty(key))) {
      var prevChild = prevChildren[key]
      diffQueue.push({
        parentId: self._rootNodeID,
        parentNode: $('[data-reactid=' + self._rootNodeID + ']'),
        type: UPDATE_TYPES.REMOVE_NODE,
        fromIndex: prevChild._mountIndex,
        toIndex: null
      })
      // 未完成 如果以前已经渲染过了，记得先去掉以前所有的事件监听，通过命名空间全部清空
      if (prevChild._rootNodeID) {
        $(document).undelegate('.' + prevChild._rootNodeID);
      }
    }
  }
}
ReactDOMComponent.prototype._patch = function () {
  
}