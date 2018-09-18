function ReactDOMTextComponent (element) {
  this._currentElement = element
  this._rootNodeId = null
}
ReactDOMTextComponent.prototype.mountComponent = function (rootId) {
  this._rootNodeId = rootId
}

export default ReactDOMTextComponent