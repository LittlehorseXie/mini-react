import ReactClass from "./vdom/ReactClass";

module.exports =  function createClass (spec) {
  var Constructor = function (props) {
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