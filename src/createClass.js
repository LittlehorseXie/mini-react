
/**
 * 暴露给用户的React方法，用来生成一个ReactClass实例
 * 
 * @return {function} Constructor
 */

// 使用方法：
// var HelloMessage = React.createClass({
//   getInitialState: function() {
//     return {type: 'say:'};
//   },
//   componentWillMount: function() {
//     console.log('我就要开始渲染了。。。')
//   },
//   componentDidMount: function() {
//     console.log('我已经渲染好了。。。')
//   },
//   render: function() {
//     return React.createElement("div", null, this.state.type, "Hello ", this.props.name);
//   }
// });

export default createClass = function (spec) {
  const Constructor = function (props) {
    this.props = props
    this.state = this.getInitialState ? this.getInitialState() : null
  }
  Constructor.prototype = new ReactClass()
  Constructor.prototype.constructor = Constructor
  Object.keys(spec).forEach(key => {
    Constructor.prototype[key] = spec[key]
  })
  return Constructor
}