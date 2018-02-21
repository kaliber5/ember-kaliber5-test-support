import $ from 'jquery';
import { nativeMouseDown, nativeMouseUp } from './ember-power-select';
import { settled } from '@ember/test-helpers';

/**
 * Add a helper function for ember-power-select that works similar to `selectChoose` (see http://www.ember-power-select.com/docs/test-helpers)
 * but within integration tests
 *
 * @param scope
 * @param valueOrSelector
 * @return {Promise}
 * @private
 */
export default async function powerSelectChoose(scope, valueOrSelector) {
  let $trigger = $(`${scope} .ember-power-select-trigger`);

  if ($trigger === undefined || $trigger.length === 0) {
    $trigger = $(scope);
  }

  if ($trigger.length === 0) {
    throw new Error(`You called "powerSelectChoose('${scope}', '${valueOrSelector}')" but no select was found using selector "${scope}"`);
  }

  let contentId = $trigger.attr('aria-owns') || $trigger.attr('aria-controls');
  let $content = $(`#${contentId}`);
  // If the dropdown is closed, open it
  if ($content.length === 0  || $content.hasClass('ember-basic-dropdown-content-placeholder')) {
    nativeMouseDown($trigger.get(0));
  }

  let potentialTargets = $(`#${contentId} .ember-power-select-option:contains("${valueOrSelector}")`).toArray();
  let target;
  if (potentialTargets.length === 0) {
    // If treating the value as text doesn't gave use any result, let's try if it's a css selector
    potentialTargets = $(`#${contentId} ${valueOrSelector}`).toArray();
  }
  if (potentialTargets.length > 1) {
    target = potentialTargets.filter((t) => t.textContent.trim() === valueOrSelector)[0] || potentialTargets[0];
  } else {
    target = potentialTargets[0];
  }
  if (!target) {
    throw new Error(`You called "selectChoose('${scope}', '${valueOrSelector}')" but "${valueOrSelector}" didn't match any option`);
  }
  nativeMouseUp(target);
  return settled();
}