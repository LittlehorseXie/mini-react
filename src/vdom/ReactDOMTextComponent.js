export default function ReactDOMTextComponent(text) {
  this._currentElement = '' + text
  this._rootNodeID = null
}
ReactDOMTextComponent.prototype.mountComponent = function(rootID) {
  this._rootNodeID = rootID
  return '<span data-reactid="' + rootID +'">' + this._currentElement + '</span>'
}

ReactDOMTextComponent.prototype.receiveComponent = function(nextText) {
  var nextStringText = '' + nextText
  if (nextStringText !== this._currentElement) {
      this._currentElement = nextStringText
      $('[data-reactid="' + this._rootNodeID + '"]').html(this._currentElement)

  }
}