import { selectChoose, selectSearch } from 'ember-power-select/test-support/helpers';
import { buildSelector, findElement } from 'ember-cli-page-object';
import { getExecutionContext } from 'ember-cli-page-object/-private/execution_context';
import { assign } from '@ember/polyfills';

export function selectableChoose(selector, userOptions = {}) {

  return {
    isDescriptor: true,

    get (key) {
      return function(textToSelect) {
        let executionContext = getExecutionContext(this);
        let options = assign({ pageObjectKey: `${key}()` }, userOptions);

        return executionContext.runAsync((context) => {
          let element = context.findWithAssert(selector, options)[0];

          return selectChoose(element, textToSelect)
            .catch(() => selectChoose(element, `[data-test-select-option=${textToSelect}]`));
        });
      };
    }
  };
}

export function selectableValue(selector, options = {}) {
  return {
    isDescriptor: true,

    get () {
      let el = findElement(this, `${selector} .ember-power-select-selected-item [data-test-select-option]`, options)[0];
      return el ? el.getAttribute('data-test-select-option') : undefined;
    }
  };
}

export function selectableSearch(selector, options = {}) {
  return {
    isDescriptor: true,

    value(textToSearch) {
      selectSearch(buildSelector(this, selector, options), textToSearch);
      return this;
    }
  };
}