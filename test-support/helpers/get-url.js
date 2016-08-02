import getPageObject from './get-page-object';
import mapPageToRoute from './map-page-to-route';

/**
 * Return a URL for the given page name. Taken from a page object with that name if available, otherwise uses `mapPageToRoute`
 *
 * @param page
 * @returns {*}
 * @public
 */
export default function getUrl(page) {
  let pageObject = getPageObject(page);
  if (pageObject && pageObject.url) {
    return pageObject.url;
  } else {
    return mapPageToRoute(page);
  }
}