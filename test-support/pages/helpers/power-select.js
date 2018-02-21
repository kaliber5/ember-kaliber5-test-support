/* global selectSearch */

import {
  buildSelector,
  getContext,
  findElement
} from 'ember-cli-page-object';
import { getExecutionContext } from 'ember-cli-page-object/-private/execution_context';
import powerSelectChoose from '../../helpers/power-select-choose';
import { settled } from '@ember/test-helpers';
import { assign } from '@ember/polyfills';

export function selectableChoose(selector, userOptions = {}) {

  return {
    isDescriptor: true,

    get(key) {
      return function(textToSelect) {
        let executionContext = getExecutionContext(this);
        let options = assign({ pageObjectKey: `${key}()` }, userOptions);

        return executionContext.runAsync((context) => {
          let fullSelector = buildSelector(this, selector, options);

          context.assertElementExists(fullSelector, options);

          return powerSelectChoose(fullSelector, textToSelect)
            .catch(() => powerSelectChoose(fullSelector, `[data-test-select-option=${textToSelect}`));
        });
      };
    }
  };
}

export function selectableValue(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      return findElement(this, selector, options).find('.ember-power-select-selected-item [data-test-select-option]').attr('data-test-select-option');
    }
  };
}

export function selectableSearch(selector, options = {}) {
  return {
    isDescriptor: true,

    value(textToSearch) {

      let context = getContext(this);

      if (context) {
        throw new Error('selectableSearch is currently not available for integration tests!');
      } else {
        settled().then(function() {
          selectSearch(buildSelector(this, selector, options), textToSearch);
        });
      }
      return this;
    }
  };
}