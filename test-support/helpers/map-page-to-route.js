/**
 * Map a natural language page name to a valid ember route. You probably should override this in your app to take
 * your apps routing structure into account!
 *
 * @param page
 * @returns {*}
 * @public
 */
import { camelize } from '@ember/string';

export default function mapPageToRoute(page) {
  return page.split(' ').map(camelize).join('/');
}