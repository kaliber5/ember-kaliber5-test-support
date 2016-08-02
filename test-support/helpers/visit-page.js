import Ember from 'ember';
import getPageObject from './get-page-object';
import getUrl from './get-url';

const { warn } = Ember;

/**
 * Visit the given page. Fetches the URL from the page object if available
 *
 * @param page
 * @returns {RSVP.Promise}
 * @public
 */
export default function visitPage(page) {
  let pageObject = getPageObject(page);

  if (pageObject) {
    // if there is a page object, then use that visit() method to visit the page
    return pageObject.visit();
  } else {
    // else construct the route name and visit it
    warn(`You visited the ${page} page directly in your tests, but you should create a page object for it!`, false, { id: 'ember-kaliber5-test-support.pageObject' });
    let route = getUrl(page);
    return visit(route);
  }
}