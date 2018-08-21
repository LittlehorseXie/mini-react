import instantiateReactComponent from '../../vdom/instantiateReactComponent'

let nextReactRootIndex = 0

/**
 * @param {import(../dom)} vdom
 * @param {import(../dom)} container
 * @param {function} callback
 */
const render = (vdom, container, callback) => {
  var componentInstance = instantiateReactComponent(vdom)
  var markup = componentInstance.mountComponent(nextReactRootIndex++)
  $(container).html(markup)
  $(document).trigger('mountReady')
}

export default render