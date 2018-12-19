function render (element, container) {
  var componentInstance = instantiateReactComponent(element)
  var markup = componentInstance.mountComponent()
  $(container).html(markup)
  $(document).trigger('mountReady')
}