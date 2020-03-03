'use strict';

(function () {
  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  };

  var getRandomElement = function (array) {
    return array[getRandomNumber(0, array.length - 1)];
  };

  var mixArray = function (array) {
    for (var i = array.length - 1; i > 0; i -= 1) {
      var j = getRandomNumber(0, array.length - 1);
      var temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }
    return array;
  };

  var getRandomArray = function (array) {
    var mixedArray = mixArray(array);
    var elementsCount = getRandomNumber(0, array.length - 1);
    return mixedArray.slice(0, elementsCount);
  };

  window.utils = {
    getRandomNumber: getRandomNumber,
    getRandomElement: getRandomElement,
    mixArray: mixArray,
    getRandomArray: getRandomArray,
  };
})();
