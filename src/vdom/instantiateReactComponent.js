import ReactDOMTextComponent from './ReactDOMTextComponent.js'
import ReactDOMComponent from './ReactDOMComponent.js'
import ReactCompositeComponent from './ReactCompositeComponent.js'

/**
 * 不管什么节点，都生成一个Component示例
 * 
 * 自定义组件 生命周期处理
 * componentWillMount   在 mountComponent 里处理
 * componentDidMount    在 mountComponent 里处理
 * componentWillUpdate  在 receiveComponent 里处理
 * 
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