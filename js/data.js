'use strict';

(function () {
  var ADS_NUMBER = 8;
  var OFFER_TITLES = ['заголовок1', 'заголовок2', 'заголовок3', 'заголовок4', 'заголовок5', 'заголовок6', 'заголовок7', 'заголовок8'];
  var OFFER_ADDRESS_MIN_X = 0;
  var OFFER_ADDRESS_MAX_X = 1200;
  var OFFER_ADDRESS_MIN_Y = 130;
  var OFFER_ADDRESS_MAX_Y = 630;
  var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var OFFER_CHECKINS = ['12:00', '13:00', '14:00'];
  var OFFER_CHECKOUTS = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var OFFER_MIN_PRICE = 3000;
  var OFFER_MAX_PRICE = 53000;
  var OFFER_MIN_ROOMS = 1;
  var OFFER_MAX_ROOMS = 8;
  var OFFER_MIN_GUESTS = 1;
  var OFFER_MAX_GUESTS = 4;
  var OFFER_DESCRIPTIONS = ['описание1', 'описание2', 'описание3', 'описание4', 'описание5'];

  var getAdContent = function (adNumber) {
    var adressPositionX = window.utils.getRandomNumber(OFFER_ADDRESS_MIN_X, OFFER_ADDRESS_MAX_X);
    var adressPositionY = window.utils.getRandomNumber(OFFER_ADDRESS_MIN_Y, OFFER_ADDRESS_MAX_Y);

    var adContent = {
      author: {
        avatar: 'img/avatars/user0' + adNumber + '.png'
      },
      offer: {
        title: window.utils.getRandomElement(OFFER_TITLES),
        address: adressPositionX + ',' + ' ' + adressPositionY,
        price: window.utils.getRandomNumber(OFFER_MIN_PRICE, OFFER_MAX_PRICE),
        type: window.utils.getRandomElement(OFFER_TYPES),
        rooms: window.utils.getRandomNumber(OFFER_MIN_ROOMS, OFFER_MAX_ROOMS),
        guests: window.utils.getRandomNumber(OFFER_MIN_GUESTS, OFFER_MAX_GUESTS),
        checkin: window.utils.getRandomElement(OFFER_CHECKINS),
        checkout: window.utils.getRandomElement(OFFER_CHECKOUTS),
        features: window.utils.getRandomArray(OFFER_FEATURES),
        description: window.utils.getRandomElement(OFFER_DESCRIPTIONS),
        photos: window.utils.getRandomArray(OFFER_PHOTOS)
      },
      location: {
        x: adressPositionX,
        y: adressPositionY
      }
    };
    return adContent;
  };


  var getAdsContent = function () {
    var adsContent = [];
    for (var i = 1; i <= ADS_NUMBER; i += 1) {
      adsContent.push(getAdContent(i));
    }
    return adsContent;
  };

  window.data = {
    getAdsContent: getAdsContent,
    OFFER_ADDRESS_MIN_Y: OFFER_ADDRESS_MIN_Y,
    OFFER_ADDRESS_MAX_Y: OFFER_ADDRESS_MAX_Y,
    OFFER_ADDRESS_MIN_X: OFFER_ADDRESS_MIN_X
  };
})();
