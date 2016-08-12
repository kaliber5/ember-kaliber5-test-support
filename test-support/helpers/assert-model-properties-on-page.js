/* jshint expr:true */
import Ember from 'ember';
import { expect } from 'chai';
import { pluralize } from 'ember-inflector';

const { get, typeOf } = Ember;

function isInt(n) {
  return parseInt(n) === n;
}

function isFloat(f) {
  return typeOf(f) === 'number' && !isInt(f);
}

/**
 * Given some models and an array of properties, check that all given properties are on the given page object collection for every model
 * Each page object collection item must have a property `modelId` that gives the ID of the rendered model
 *
 * @function assertPropertiesAllModelsAreOnPage
 * @param models
 * @param properties
 * @param pageCollection
 * @public
 */
export default function assertPropertiesOfAllModelsOnPage(models, properties, pageCollection) {
  expect(models).to.be.an('array');
  models.forEach((modelInstance) => {
    let id = get(modelInstance, 'id');
    let [ collectionItem ] = pageCollection().filterBy('modelId', id);
    expect(collectionItem, `No collection item found for model ID ${id}`).to.exist;
    return assertModelPropertiesOnPage(modelInstance, properties, collectionItem);
  });
}

/**
 * Given a single model and an array of properties, check that all given properties are on the given page object component
 *
 * @param model
 * @param properties
 * @param pageComponent
 * @public
 */
export function assertModelPropertiesOnPage(model, properties, pageComponent) {
  expect(properties).to.be.an('array');
  properties.forEach((property) => {
    let modelValue = get(model, property);
    if (isFloat(modelValue)) {
      expect(get(pageComponent, property.replace('.', '-').camelize()), `${property} does not match expected value`).to.be.closeTo(modelValue, 0.000001);
    } else {
      expect(get(pageComponent, property.replace('.', '-').camelize()), `${property} does not match expected value`).to.equal(modelValue);
    }
  });
}