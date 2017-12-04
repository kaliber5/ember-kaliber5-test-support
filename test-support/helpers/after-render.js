import { scheduleOnce } from '@ember/runloop';

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
    scheduleOnce('afterRender', this, fn, ...arguments);
  });
}