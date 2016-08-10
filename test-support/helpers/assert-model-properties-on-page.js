/* jshint expr:true */
import Ember from 'ember';
import { expect } from 'chai';
import { pluralize } from 'ember-inflector';

const { isArray, get } = Ember;

/**
 * Given a modelName and an array of properties, check that all given properties are on the given page object for every model
 *
 * @param modelName
 * @param models
 * @param properties
 * @param pageObject
 * @public
 */
export default function assertModelPropertiesOnPage(modelName, models, properties, pageObject) {
  expect(models).to.be.an('array');
  expect(properties).to.be.an('array');
  let pageCollection = pageObject[pluralize(modelName.camelize())];
  models.forEach((modelInstance) => {
    let id = get(modelInstance, 'id');
    let [ collectionItem ] = pageCollection().filterBy('modelId', id);
    expect(collectionItem, `No collection item found for ${modelName} with ID ${id}`).to.exist;
    properties.forEach((property) => {
      if (isArray(property)) {
        property = property[0];
      }
      expect(get(collectionItem, property.replace('.', '-').camelize())).to.equal(get(modelInstance, property));
    });
  });
}