import { warn } from '@ember/debug';
import getPageObject from './get-page-object';
import getUrl from './get-url';
import { visit } from 'ember-native-dom-helpers';

/**
 * Visit the given page. Fetches the URL from the page object if available
 *
 * @param page
 * @param params
 * @returns {RSVP.Promise}
 * @public
 */
export default async function visitPage(page, params) {
  let pageObject = getPageObject(page);

  if (pageObject) {
    // if there is a page object, then use that visit() method to visit the page
    await pageObject.visit(params);
  } else {
    // else construct the route name and visit it
    warn(`You visited the ${page} page directly in your tests, but you should create a page object for it!`, false, { id: 'ember-kaliber5-test-support.pageObject' });
    let route = getUrl(page);
    await visit(route);
  }
}