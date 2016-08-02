import selectElement from './select-element';

/**
 * Select input/textarea/select by data-test-selector or name attribute
 *
 * @param value
 * @returns {string}
 * @public
 */
export default function selectInput(value) {
  value = value.replace(/ /g, '-');
  return ['input', 'textarea', 'select'].map((tag) => `${tag}${selectElement(value)}, ${tag}[name="${value}"]`).join(', ');
}