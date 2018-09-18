
### React暴露的接口

React.createClass 
  功能：创建自定义组件
  参数：一个object，包含了render等
  返回：一个ReactClass

React.CreateElement 
  功能：创建一个虚拟DOM
  参数：type, config, children
  返回：经过一系列参数转变，将type, key, props传给ReactElement，生成一个ReactElement

React.render 
  功能：渲染虚拟DOM--将ReactElement拼接成字符串插入到html的DOM容器中
  参数：通过CreateElement生成的ReactElement 和 html中的DOM容器
  返回：无

### DOM

#### ReactClass
每个ReactClass都自带两个函数render和setState

render返回一个由React.CreateElement生成的ReactElement

setState会调用

#### ReactElement


