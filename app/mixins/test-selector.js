import Ember from 'ember';
import ENV from '../config/environment';

const { computed } = Ember;
const { getPrototypeOf } = Object;

let TestSelectorMixin;

if (ENV.environment !== 'production') {
  TestSelectorMixin = Ember.Mixin.create({
    attributeBindings: 'data-test-selector',

    'data-test-selector': computed(function() {
      return getPrototypeOf(this)._debugContainerKey.replace(/^component:/, '');
    })
  });
} else {
  TestSelectorMixin = Ember.Mixin.create();
}

export default TestSelectorMixin;