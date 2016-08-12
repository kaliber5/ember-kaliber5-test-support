import Ember from 'ember';

/**
 * Function for use in component integration tests to wait for a promise to resolve and the following "render"
 * Ember.run queue
 *
 * @param promise
 * @param fn
 * @returns {*}
 * @public
 */
export default function afterRender(promise, fn) {
  return promise.then(function() {
    Ember.run.scheduleOnce('afterRender', this, fn, ...arguments);
  });
}