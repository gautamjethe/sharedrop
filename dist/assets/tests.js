'use strict';

define("sharedrop/tests/test-helper", ["@ember/test-helpers", "ember-qunit", "sharedrop/app", "sharedrop/config/environment"], function (_testHelpers, _emberQunit, _app, _environment) {
  "use strict";

  /* eslint */
  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define('sharedrop/config/environment', [], function() {
  var prefix = 'sharedrop';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('sharedrop/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
