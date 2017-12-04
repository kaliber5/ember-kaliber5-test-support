import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { deprecate } from '@ember/application/deprecations';
import ENV from '../config/environment';

const { getPrototypeOf } = Object;

let TestSelectorMixin;

if (ENV.environment !== 'production') {
  TestSelectorMixin = Mixin.create({
    attributeBindings: 'data-test-selector',

    init() {
      this._super(...arguments);
      deprecate('You should not use the TestSelector mixin any more. Consider upgrading to the latest version of ember-test-selectors instead!', false, { id: 'ember-kaliber5-test-support.TestSelectorMixin', until: '2.0.0' });
    },

    'data-test-selector': computed(function() {
      return getPrototypeOf(this)._debugContainerKey.replace(/^component:/, '');
    })
  });
} else {
  TestSelectorMixin = Mixin.create();
}

export default TestSelectorMixin;