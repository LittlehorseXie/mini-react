import ReactElement from "./vdom/reactElement";

// 暴露给用户的React方法，用来生成一个ReactElement实例

export default createElement = function (type, config, children) {
  let props = Object.assign({}, config)
  let key = config.key || null

  if(arguments.length === 3) {
    props.children = Array.isArray(children) ? children : [children]
  } else if (arguments.length > 3) {
    let childArray = []
    for(let i = 2; i < arguments.length; i++) {
      childArray.push(arguments[i])
    }
    props.children = childArray
  }

  return new ReactElement(type, key, props)
}