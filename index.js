'use strict';

module.exports = {
  name: 'ember-kaliber5-test-support',

  included(app) {
    let testSelectorPatch = 'vendor/add-default-test-selector.js';
    app.import({
      development: testSelectorPatch,
      test: testSelectorPatch
    });
  },

  isDevelopingAddon: function() {
    return true;
  }
};
