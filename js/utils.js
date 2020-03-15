'use strict';

(function () {
  var getBlockElements = function (array) {
    array.forEach(function (element) {
      element.setAttribute('disabled', true);
    });
  };

  var getUnblockElements = function (array) {
    array.forEach(function (element) {
      element.removeAttribute('disabled');
    });
  };

  window.utils = {
    getBlockElements: getBlockElements,
    getUnblockElements: getUnblockElements
  };
})();
