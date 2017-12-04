/* jshint expr:true */
import { get } from '@ember/object';

import { typeOf } from '@ember/utils';
import { expect } from 'chai';

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
 * @param {Function} transform
 * @public
 */
export default function assertPropertiesOfAllModelsOnPage(models, properties, pageCollection, transform) {
  expect(models).to.be.an('array');
  models.forEach((modelInstance) => {
    let id = get(modelInstance, 'id');
    let [ collectionItem ] = pageCollection().filterBy('modelId', id);
    expect(collectionItem, `No collection item found for model ID ${id}`).to.exist;
    return assertModelPropertiesOnPage(modelInstance, properties, collectionItem, transform);
  });
}

/**
 * Given a single model and an array of properties, check that all given properties are on the given page object component
 *
 * @param {Object} model
 * @param {Array} properties
 * @param pageComponent
 * @param {Function} transform
 * @public
 */
export function assertModelPropertiesOnPage(model, properties, pageComponent, transform) {
  expect(properties).to.be.an('array');
  properties.forEach((property) => {
    let modelValue = get(model, property);
    if (typeof transform === 'function') {
      modelValue = transform.call(model, property, modelValue);
    }
    if (isFloat(modelValue)) {
      expect(get(pageComponent, property.replace('.', '-').camelize()), `${property} does not match expected value`).to.be.closeTo(modelValue, 0.000001);
    } else {
      expect(get(pageComponent, property.replace('.', '-').camelize()), `${property} does not match expected value`).to.equal(modelValue);
    }
  });
}