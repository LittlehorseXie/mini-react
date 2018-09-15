// 通过继承React.createClass生成

function ReactClass () {
}
ReactClass.prototype.render = function () {}

ReactClass.prototype.setState = function (newState) {
  this._reactInternalInstance.receiveComponent(null, newState)
}

export default ReactClass