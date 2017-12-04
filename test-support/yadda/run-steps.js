import { Promise as EmberPromise } from 'rsvp';
import yadda from '../helpers/yadda';

/**
 * Reuse other yadda steps
 *
 *     return runSteps(['When I do something','Then I see something'], stepLibrary());
 *
 * @param steps
 * @param library
 * @returns {Ember.RSVP.Promise}
 * @public
 */
export default function(steps, library) {
  return new EmberPromise(function(resolve) {
    yadda.Yadda(library, this)
      .yadda(steps, { ctx: {} }, resolve);
  });
}