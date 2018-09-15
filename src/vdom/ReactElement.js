// 通过React.createElement生成，自带key值的虚拟DOM
// React.createElement参数为type config children, 其中
//    type 保持不变
//    config.key 单独提了出来，成为了 key
//    children 现在成为了 props.children

export default function ReactElement (type, key, props) {
  this.type = type
  this.key = key
  this.props = props
}