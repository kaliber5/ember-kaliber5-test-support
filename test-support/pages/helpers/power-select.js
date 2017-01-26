import { buildSelector, getContext, findElement } from 'ember-cli-page-object';
import testSelector from 'ember-test-selectors';
import powerSelectChoose from '../../helpers/power-select-choose';
import waitHelper from 'ember-test-helpers/wait';


export function selectableChoose(selector, options = {}) {
  return {
    isDescriptor: true,

    value(textToSelect) {

      let context = getContext(this);

      if (context) {
        waitHelper()
          .then(() => powerSelectChoose(buildSelector(this, selector, options), textToSelect))
          .catch(() => powerSelectChoose(buildSelector(this, selector, options), testSelector('select-option', textToSelect)))
        ;
      } else {
        wait()
          .then(() => selectChoose(buildSelector(this, selector, options), textToSelect))
          .catch(() => selectChoose(buildSelector(this, selector, options), testSelector('select-option', textToSelect)))
        ;
      }
      return this;
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
        throw new Error('selectableChoose is currently not available for integration tests!');
      } else {
        wait().then(function() {
          selectSearch(buildSelector(this, selector, options), textToSearch);
        });
      }
      return this;
    }
  };
}