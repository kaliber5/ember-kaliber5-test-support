/* global Ember */

(function() {
  Ember.Component.reopen({
    init: function() {
      if (this.get('tagName') !== ''
        && Ember.isEmpty(this.get('data-test-selector'))
        && typeof this._debugContainerKey === 'string'
      ) {
        this.set('data-test-selector', this._debugContainerKey.replace(/^component:/, ''));
      }
      // make sure we call _super afterwards, so the init of ember-test-selectors can see our change
      // see https://github.com/simplabs/ember-test-selectors/blob/master/vendor/ember-test-selectors/patch-component.js
      this._super.apply(this, arguments);
    }
  });
})();