/** @module extendTemplate
 * Inserts a template into another.
 * @param {httpPair} pair - the pair object (need the template engine)
 * @param {object} source - the template to be injected into destination --
 *   should have 'template' property to denote the template to render and optional 'variables' property
 * @param {object} destination - the template that source will be inserted into --
 *   should have 'template' property to denote the template to render and optional 'variables' property
 * @param {string} keyword [optional] - the variable in destination to bind source to (defaults to 'content')
 * @returns {string} the rendererd template
 */
module.exports = function extendTemplate(pair, source, destination, keyword = 'content') {
  var destinationOptions = destination.variables || { title: 'Final Frontier' }
  
  destinationOptions[keyword] = pair.templates.render(source.template, source.variables || {})
  
  return pair.templates.render(destination.template, destinationOptions)
}