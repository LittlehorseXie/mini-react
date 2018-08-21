import ReactClass from '../../vdom/ReactClass.js'

function createClass(spec) {
  let Constructor = function (props) {
    this.props = props
    this.state = this.getInitialState ? this.getInitialState() : null
    // 原型继承
    Constructor.prototype = new ReactClass()
    Constructor.prototype.constructor = Constructor
    //混入spec到原型
    $.extend(Constructor.prototype, spec)
    return Constructor
  }
}

export default createClass