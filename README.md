本小马励志从0开始实现一个简单的mini-react

### 先从最简单的开始

首先我们使用最简单react的时候，一定是类似下面的用法

```html
<!-- dom 结构 -->
<div id="app"></div>
```
```javascript
// react插入虚拟dom
React.render('hello word', document.getElementById('app'))
```

最后生成的html为:
```html
<div id="app">
  <span data-reactid="0">hello word</span>
</div>
```

表面上看，我们只用到了`React.render`一个方法，但实际上'hello word'的渲染还使用了`React.createElement`来生成一个React的虚拟DOM--`ReactElement`。

也就是说，上面的代码，规范来写的话应该类似下面：

```javascript
function hello () {
  alert('hello')
}
// 通过React.createElement生成一个ReactElement类型的element
const element = React.createElement('div', {id: 'test', onclick: hello}, 'click me')
// 通过React.render像html中插入虚拟dom--element
React.render(element, document.getElementById('app'))
```

生成的html为：
```html
<div data-reactid="0" id="test">
    <span data-reactid="0.0">click me</span>
</div>
<!-- 点击文字，会弹出hello的对话框 -->
```