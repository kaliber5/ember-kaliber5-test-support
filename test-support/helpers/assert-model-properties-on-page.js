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
 * Given a modelName and an array of properties, check that all given properties are on the given page object for every model
 *
 * @param modelName
 * @param models
 * @param properties
 * @param pageCollection
 * @public
 */
export default function assertModelPropertiesOnPage(modelName, models, properties, pageCollection) {
  expect(models).to.be.an('array');
  expect(properties).to.be.an('array');
  models.forEach((modelInstance) => {
    let id = get(modelInstance, 'id');
    let [ collectionItem ] = pageCollection().filterBy('modelId', id);
    expect(collectionItem, `No collection item found for ${modelName} with ID ${id}`).to.exist;
    properties.forEach((property) => {
      let modelValue = get(modelInstance, property);
      if (isFloat(modelValue)) {
        expect(get(collectionItem, property.replace('.', '-').camelize()), `${property} does not match expected value`).to.be.closeTo(modelValue, 0.000001);
      } else {
        expect(get(collectionItem, property.replace('.', '-').camelize()), `${property} does not match expected value`).to.equal(modelValue);
      }
    });
  });
}