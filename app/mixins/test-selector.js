import Ember from 'ember';
import ENV from '../config/environment';

const { computed, deprecate } = Ember;
const { getPrototypeOf } = Object;

let TestSelectorMixin;

if (ENV.environment !== 'production') {
  TestSelectorMixin = Ember.Mixin.create({
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
  TestSelectorMixin = Ember.Mixin.create();
}

export default TestSelectorMixin;