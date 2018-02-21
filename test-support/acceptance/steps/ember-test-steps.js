import { find, findAll, click, currentURL, settled, waitFor } from '@ember/test-helpers';
import { warn } from '@ember/debug';
import { camelize } from '@ember/string';
import yadda from '../../helpers/yadda';
import { expect } from 'chai';
import visitPage from '../../helpers/visit-page';
import getPageObject from '../../helpers/get-page-object';
import getUrl from '../../helpers/get-url';
import selectElement from '../../helpers/select-element';
import selectInput from '../../helpers/select-input';
import csvConverter from '../../yadda/converters/csv';
import csvHashConverter from '../../yadda/converters/csv-hash';
import indexMappingConverter from '../../yadda/converters/index-mapping';
import { singularize } from 'ember-inflector';

export const dictionary = new yadda.Dictionary()
  // this does unfortunately not work as expected, assertion exceptions are cacthed and never show up as errors in the test report
  // This might be a bug in ember-cli-yadda actually rather than yadda itself
  .define('table', /([^\u0000]*)/, yadda.converters.table)
  .define('csv', /([^\u0000]*)/, csvConverter)
  .define('csvHash', /([^\u0000]*)/, csvHashConverter)
  .define('index', /(\w+)/, indexMappingConverter)
  .define('number', /(\d+)/, yadda.converters.integer)
  .define('integer', /(\d+)/, yadda.converters.integer)
  .define('float', /([-+]?[0-9]*\.?[0-9]+)/, yadda.converters.float)
  .define('date', /(\d+)/, yadda.converters.date)
  ;

/**
 * Defines some useful steps for acceptance tests
 *
 * @public
 */
export function steps(steps) {
  return steps
    .given('I am on the "?(.*?)"?(?:| page)$', async function(page) {
      await visitPage(page);
      this.ctx.pageObject = getPageObject(page);
    })
    .when('I go to the "?(.*?)"?(?:| page)$', async function(page) {
      await visitPage(page);
      this.ctx.pageObject = getPageObject(page);
    })
    .then('I should (?:|still )be on the "?(.*?)"?(?:| page)$', function(page) {
      let url = getUrl(page);
      let escapedUrl = url
        .replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
        .replace(/:[^/]+/g, '[^/]+');
      let current = currentURL();
      expect(current).to.match(new RegExp(`^${escapedUrl}(?:\\?.*)?$`), `current page should be ${url}, but is ${current}`);
      this.ctx.pageObject = getPageObject(page);
    })
    .given('there is an? $selector (?:item|element|link)$', function(selector) {
      let el = find(selectElement(selector));
      expect(el, `No ${selector} element found`).to.exist;
    })
    .given('there is an? $selector (form|input|button)', function(selector, element) {
      let el = find(`${element}${selectElement(selector)}`);
      expect(el, `No ${selector} ${element} found`).to.exist;
    })
    .then('I should see an? ([\\w -]+?) message', async function(messageType) {
      messageType = messageType.replace(/ /g, '-');
      let selector = selectElement(`${messageType}-message`);
      // wait for async flash messages
      try {
        await waitFor(selector);
      } catch(e) {
        throw new Error(`No ${messageType} message found`);
      }
    })
    .when('I (?:click|press) (?:on )?(?:the|an?) "?([\\w -]+?)"?(?:| button| item| element| link| checkbox)$', async function(selector) {
      let page = this.ctx.pageObject;
      let pageAction = camelize(selector);
      if (page && page[pageAction]) {
        await page[pageAction]();
      } else {
        warn(`Accessing page elements without a page object is deprecated.`, false, { id: 'ember-kaliber5-test-support.pageObject' });
        await click(selectElement(selector));
      }
    })
    .then('I should see (?:an?|the) "?([\\w -]*?)"? (?:item|element|link)$', function(selector) {
      let el = find(selectElement(selector));
      expect(el, `No ${selector} element found`).to.exist;
    })
    .then('I should see (?:an?|the) "?([\\w -]+?)"? (input|button)$', function(selector, element) {
      let longSelector = `${selector}-${element}`; // allows matching of e.g. form[data-test-selector=user-form] when selector="user form" and element=form
      let el = find(`${element}${selectElement(selector)}, ${element}${selectElement(longSelector)}`);
      expect(el, `No ${selector} ${element} found`).to.exist;
    })
    .then('I should see (?:an?|the) "?([\\w -]+?)"? form$', function(selector) {
      let longSelector = `${selector}-form`; // allows matching of e.g. form[data-test-selector=user-form] when selector="user form" and element=form
      let el = find(`form${selectElement(selector)}, form${selectElement(longSelector)}, ${selectElement(selector)} form, ${selectElement(longSelector)} form`);
      expect(el, `No ${selector} form found`).to.exist;
    })
    .then('I should not see an? "?([\\w -]*?)"? (?:button|item|element|link)$', function(selector) {
      let el = find(selectElement(selector));
      expect(el, `${selector} element found`).to.not.exist;
    })
    .then('there is a link to the "?(.*?)"?(?:| page)$', function(page) {
      let url = getUrl(page);
      let el = findAll(`a[href="${url}"]`);
      expect(el.length).to.be.at.least(1, `No link to ${url} found`);
    })
    .then('there should be a form error at (.*?)$', function(selector) {
      let el = find(`.has-error ${selectInput(selector)}`);
      expect(el, `No form error on ${selector} element found`).to.exist;
    })
    .then('I should (not|) ?see a modal dialog', async function(not) {
      // wait for fade effect
      await settled();
      let el = find('.modal.in .modal-dialog');
      if (not) {
        expect(el).to.not.exist;
      } else {
        expect(el).to.exist;
      }
    })

    // mirage stuff
    .given('there (?:are|is) ?([0-9]*) ([a-z-]+)(?: models)? in my database', function(count, model) {
      count = parseInt(count) || 10;
      model = singularize(model);
      this.ctx.db = this.ctx.db || {};
      this.ctx.db[model] = server.createList(model, count);
    })
    .given('there (?:are|is) ?([0-9]*) ([a-z-]+)(?: models)? in my database with the following properties:\n$csv', function(count, model, csv) {
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
    .given('there are the following ([a-z-]+)(?: models)? in my database:\n$csvHash', function(model, csv) {
      let models = [];
      model = singularize(model);

      csv.forEach((item) => {
        models.push(server.create(model, item));
      });
      this.ctx.db = this.ctx.db || {};
      this.ctx.db[model] = models;
    })
    ;
}

export default function() {
  return steps(yadda.localisation.English.library(dictionary));
}