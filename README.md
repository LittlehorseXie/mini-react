### 从最简单的开始

```javascript
React.render('hello world',document.getElementById("container"))

// 对应的html为
<div id="container"></div>

// 生成的html为
<div id="container">
  <span data-reactid="0">hello world</span>
</div>
```
功能点：
React.render

### 引入基本element

```javascript
function hello() {
  alert('hi')
}
var element = React.creatElement('div', {id: 'test', onclick: hello}, 'click me')
React.render(element,document.getElementById("container"))

// 生成的html为
<div id="test">
  <span data-reactid="0">click me</span>
</div>
// 点击文字，弹出hi对话框
```
功能点：
React.creatElement -- type, config, children
React.render

### 自定义元素
```javascript
var HelloMessage = React.createClass({
  getInitialState: function() {
    return {type: 'say:'};
  },
  componentWillMount: function() {
    console.log('我就要开始渲染了。。。')
  },
  componentDidMount: function() {
    console.log('我已经渲染好了。。。')
  },
  changeType:function(){
    this.setState({type:'shout:'})
  },
  render: function() {
    return React.createElement("div", {onclick: this.changeType}, this.state.type, "Hello ", this.props.name);
  }
});

React.render(React.createElement(HelloMessage, {name: "John"}), document.getElementById("container"));

// 生成的html为
<div data-reactid="0">
  <span data-reactid="0.0">say:</span>
  <span data-reactid="0.1">Hello </span>
  <span data-reactid="0.2">John</span>
</div>
// 点击文字，say会变成shout
```
功能点：
React.createClass
React.createElement -- type, config, children
React.render

## 按文件梳理
