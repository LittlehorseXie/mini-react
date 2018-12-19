import ReactDOMTextComponent from './ReactDOMTextComponent.js'
import ReactDOMComponent from './ReactDOMComponent.js'
import ReactCompositeComponent from './ReactCompositeComponent.js'

export default function instantiateReactComponent(element) {
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