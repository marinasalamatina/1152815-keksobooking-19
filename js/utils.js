'use strict';

(function () {
  var getBlockElements = function (elements, isDisabled) {
    elements.forEach(function (element) {
      element.disabled = isDisabled;
    });
  };

  window.utils = {
    getBlockElements: getBlockElements
  };
})();
