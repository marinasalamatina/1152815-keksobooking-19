'use strict';

var NUMBER_ADS = 8;
var NUMBER_AVATAR = ['01', '02', '03', '04', '05', '06', '07', '08'];
var OFFER_TITLE = ['заголовок1', 'заголовок2', 'заголовок3', 'заголовок4', 'заголовок5', 'заголовок6', 'заголовок7', 'заголовок8'];
var OFFER_ADDRESS = ['600, 350'];
var offerPrice = [3000, 3500];
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var offerRooms = [1, 2, 3, 4];
var offerGuests = [1, 2, 3, 4];
var OFFER_CHECKIN = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUT = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var offerDescription = ['описание1', 'описание2', 'описание3', 'описание4', 'описание5'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MARK_MIN_Y = 130;
var MARK_MAX_Y = 630;
var markMinX = 200;
var markMaxX = 800;

var getMarkMap = function (min, max) {
  return Math.random() * (max - min) + min;
};

var getRandomNumber = function (array) {
  Math.round(Math.random() * (array.length - 1));
};

var getRandomValue = function (array) {
  return array[getRandomNumber(array)];
};

var getAdsContent = function () {
  var adsContent = [];
  for (var i = 0; i < NUMBER_ADS; i += 1) {
    var adContent = {
      author: {
        avatar: 'img/avatars/' + 'user' + getRandomValue(NUMBER_AVATAR) + '.png'
      },
      offer: {
        title: getRandomValue(OFFER_TITLE),
        address: getRandomValue(OFFER_ADDRESS),
        price: getRandomValue(offerPrice),
        type: getRandomValue(OFFER_TYPE),
        rooms: getRandomValue(offerRooms),
        guests: getRandomValue(offerGuests),
        checkin: getRandomValue(OFFER_CHECKIN),
        checkout: getRandomValue(OFFER_CHECKOUT),
        features: getRandomValue(OFFER_FEATURES),
        description: getRandomValue(offerDescription),
        photos: getRandomValue(OFFER_PHOTOS)
      },
      location: {
        x: getMarkMap(markMinX, markMaxX),
        y: getMarkMap(MARK_MIN_Y, MARK_MAX_Y)
      }
    };
    adsContent.push(adContent);
  }
  return adsContent;
};

var createAd = function () {
  var ad;
  return ad;
};

var addAdsContent = function () {
  var fragment = document.createDocumentFragment();
  var adsContent = getAdsContent();

  for (var i = 0; i < adsContent.length; i += 1) {
    fragment.appendChild(createAd(adsContent[i]));
  }
  return fragment;
};

addAdsContent();
