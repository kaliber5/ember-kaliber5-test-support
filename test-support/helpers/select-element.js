import testSelector from 'ember-test-selectors';

/**
 * Shorthand version of testselector, using the convention of data-test-selector=<value>
 *
 * @param value
 * @returns {string}
 * @public
 */
export default function selectElement(value) {
  return testSelector('selector', value.replace(/ /g, '-'));
}