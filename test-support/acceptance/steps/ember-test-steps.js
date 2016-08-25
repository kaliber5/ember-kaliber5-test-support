/* jshint expr:true */

import yadda from '../../helpers/yadda';
import { expect } from 'chai';
import Ember from 'ember';
import visitPage from '../../helpers/visit-page';
import getPageObject from '../../helpers/get-page-object';
import getUrl from '../../helpers/get-url';
import selectElement from '../../helpers/select-element';
import selectInput from '../../helpers/select-input';
import csvConverter from '../../yadda/converters/csv';
import csvHashConverter from '../../yadda/converters/csv-hash';
import indexMappingConverter from '../../yadda/converters/index-mapping';
import { pluralize, singularize } from 'ember-inflector';

const { warn } = Ember;

export const dictionary = new yadda.Dictionary()
  // this does unfortunately not work as expected, assertion exceptions are cacthed and never show up as errors in the test report
  // This might be a bug in ember-cli-yadda actually rather than yadda itself
  .define('table', /([^\u0000]*)/, yadda.converters.table)
  .define('csv', /([^\u0000]*)/, csvConverter)
  .define('csvHash', /([^\u0000]*)/, csvHashConverter)
  .define('index', /(\w+)/, indexMappingConverter)
  .define('number', /(\d+)/, yadda.converters.integer)
  .define('float', /(\d+)/, yadda.converters.float)
  .define('date', /(\d+)/, yadda.converters.date)
  ;

/**
 * Defines some useful steps for acceptance tests
 *
 * @public
 */
export function steps(steps) {
  return steps
    .given('I am on the "?(.*?)"?(?:| page)$', function(page, next) {
      visitPage(page);
      this.ctx.pageObject = getPageObject(page);
      andThen(() => next());
    })
    .when('I go to the "?(.*?)"?(?:| page)$', function(page, next) {
      visitPage(page);
      this.ctx.pageObject = getPageObject(page);
      andThen(() => next());
    })
    .then('I should (?:|still )be on the "?(.*?)"?(?:| page)$', function(page) {
      let url = getUrl(page);
      let escapedUrl = url.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      expect(currentURL()).to.match(new RegExp(`^${escapedUrl}(?:\\?.*)?`), `current page should be ${url}, but is ${currentURL()}`);
      this.ctx.pageObject = getPageObject(page);
    })
    .given('there is an? $selector (?:item|element|link)$', function(selector) {
      let el = find(selectElement(selector));
      expect(el.length).to.equal(1, `No ${selector} element found`);
    })
    .given('there is an? $selector (form|input|button)', function(selector, element) {
      let el = find(`${element}${selectElement(selector)}`);
      expect(el.length).to.equal(1, `No ${selector} ${element} found`);
    })
    .then('I should see an? ([\\w -]+?) message', function(messageType) {
      messageType = messageType.replace(/ /g, '-');
      let el = find(selectElement(`${messageType}-message`));
      expect(el.length).to.equal(1, `No ${messageType} message found`);
    })
    .when('I (?:click|press) (?:on )?(?:the|an?) "?([\\w -]+?)"?(?:| button| item| element| link| checkbox)$', function(selector, next) {
      let page = this.ctx.pageObject;
      let pageAction = selector.camelize();
      if (page && page[pageAction]) {
        page[pageAction]();
      } else {
        warn(`Accessing page elements without a page object is deprecated.`, false, { id: 'ember-kaliber5-test-support.pageObject' });
        click(selectElement(selector));
      }
      andThen(() => next());
    })
    .then('I should see (?:an?|the) "?([\\w -]*?)"? (?:item|element|link)$', function(selector) {
      let el = find(selectElement(selector));
      expect(el.length).to.equal(1, `No ${selector} element found`);
    })
    .then('I should see (?:an?|the) "?([\\w -]+?)"? (form|input|button)$', function(selector, element) {
      let longSelector = `${selector}-${element}`; // allows matching of e.g. form[data-test-selector=user-form] when selector="user form" and element=form
      let el = find(`${element}${selectElement(selector)}, ${element}${selectElement(longSelector)}`);
      expect(el.length).to.equal(1, `No ${selector} ${element} found`);
    })
    .then('I should not see an? "?([\\w -]*?)"? (?:button|item|element|link)$', function(selector) {
      let el = find(selectElement(selector));
      expect(el.length).to.equal(0, `${selector} element found`);
    })
    .then('there is a link to the "?(.*?)"?(?:| page)$', function(page) {
      let url = getUrl(page);
      let el = find(`a[href="${url}"]`);
      expect(el.length).to.be.at.least(1, `No link to ${url} found`);
    })
    .then('there should be a form error at (.*?)$', function(selector) {
      let el = find(`.has-error ${selectInput(selector)}`);
      expect(el.length).to.equal(1, `No form error on ${selector} element found`);
    })
    .then('I should (not|) ?see a modal dialog', function(not, next) {
      // wait for fade effect
      window.setTimeout(() => {
        expect(find('.modal-dialog').length).to.equal(not === 'not' ? 0 : 1);
        next();
      }, 500);
    })

    // mirage stuff
    .given('there (?:are|is) ?([0-9]*) ([a-z\-]+)(?: models)? in my database', function(count, model) {
      count = parseInt(count) || 10;
      model = singularize(model);
      this.ctx.db = this.ctx.db || {};
      this.ctx.db[model] = server.createList(model, count);
    })
    .given('there (?:are|is) ?([0-9]*) ([a-z\-]+)(?: models)? in my database with the following properties:\n$csv', function(count, model, csv) {
      let properties = csv
        .reduce((prev, [key, value]) => {
          prev[key] = value;
          return prev;
        }, {});
      count = parseInt(count) || 10;
      model = singularize(model);
      this.ctx.db = this.ctx.db || {};
      this.ctx.db[model] = server.createList(model, count, properties);
    })
    ;
}

export default function() {
  return steps(yadda.localisation.English.library(dictionary));
}