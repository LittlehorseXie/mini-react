import instantiateReactComponent from './vdom/instantiateReactComponent.js'

/**
 * 将 element 渲染到 container 中
 * @param {ReactElement} element 
 * @param {DOM} container 
 */

export default render = function (element, container) {
  // 处理不同类型的element
  let componentInstance = instantiateReactComponent(element)
  // 调用不同element的mountComponent函数，拼接dom
  let makeup = componentInstance.mountComponent(id++)
  // 将拼接好的dom渲染到html里
  container.html(makeup)
  // 发送渲染完毕的事件
  $(document).trigger('mountReady')
}