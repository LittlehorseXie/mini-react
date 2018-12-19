/**
 * 通过React.createClass生成
 */

export default function ReactClass () {

}

ReactClass.prototype.render = function () {
}
ReactClass.prototype.setState = function(newState) {
  this._reactInternalInstance.receiveComponent(null, newState)

}
