'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var LEFT_BUTTON_MOUSE = 0;

  var adParameters = {
    MAX_PRICENIGHT: 1000000
  };

  var pinParameters = {
    PIN_MAIN_MIN_X: 0,
    PIN_MAIN_MIN_Y: 130,
    PIN_MAIN_MAX_Y: 630,
    ADS_NUMBER: 5
  };

  var backendParameters = {
    SAVE_URL: 'https://js.dump.academy/keksobooking',
    LOAD_URL: 'https://js.dump.academy/keksobooking/data',
    MAX_TIMEOUT: 10000,
    SUCCESS_CODE: 200
  };

  var filterPrice = {
    LOW_PRICE: 10000,
    HIGH_PRICE: 50000
  };

  var offerTypeList = {
    'bungalo': {
      name: 'Бунгало',
      minPrice: 0
    },
    'flat': {
      name: 'Квартира',
      minPrice: 1000
    },
    'house': {
      name: 'Дом',
      minPrice: 5000
    },
    'palace': {
      name: 'Дворец',
      minPrice: 10000
    }
  };

  window.constants = {
    backendParameters: backendParameters,
    offerTypeList: offerTypeList,
    DEBOUNCE_INTERVAL: DEBOUNCE_INTERVAL,
    filterPrice: filterPrice,
    adParameters: adParameters,
    pinParameters: pinParameters,
    LEFT_BUTTON_MOUSE: LEFT_BUTTON_MOUSE
  };

})();
