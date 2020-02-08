'use strict';

var NUMBER_ADS = 8;

var NUMBER_AVATAR = ['1', '2', '3', '4', '5', '6', '7', '8'];
var OFFER_TITLE = ['заголовок1', 'заголовок2', 'заголовок3', 'заголовок4', 'заголовок5', 'заголовок6', 'заголовок7', 'заголовок8'];
var OFFER_ADDRESS = ['600, 350'];
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECKIN = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUT = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AD_LOCATION_MIN_Y = 130;
var AD_LOCATION_MAX_Y = 630;

var offerPrice = [3000, 3500];
var offerRooms = [1, 2, 3, 4];
var offerGuests = [1, 2, 3, 4];
var offerDescription = ['описание1', 'описание2', 'описание3', 'описание4', 'описание5'];
var adLocationMinX = 0;
var adLocationMaxX = 1200;

var markMap = document.querySelector('#pin').content.querySelector('.map__pin');
var markImage = document.querySelector('#pin').content.querySelector('img');

var getRandomNumber = function (array) {
  return Math.round(Math.random() * (array.length - 1));
};

var getRandomValue = function (array) {
  return array[getRandomNumber(array)];
};

var getAdLocation = function (min, max) {
  return Math.random() * (max - min) + min;
};

var getAdContent = function (number) {
  var adContent = {
    author: {
      avatar: 'img/avatars/user0' + NUMBER_AVATAR[number] + '.png'
    },
    offer: {
      title: OFFER_TITLE[number],
      address: OFFER_ADDRESS[number],
      price: offerPrice[number],
      type: getRandomValue(OFFER_TYPE),
      rooms: offerRooms[number],
      guests: offerGuests[number],
      checkin: getRandomValue(OFFER_CHECKIN),
      checkout: getRandomValue(OFFER_CHECKOUT),
      features: getRandomValue(OFFER_FEATURES),
      description: offerDescription[number],
      photos: getRandomValue(OFFER_PHOTOS)
    },
    location: {
      x: getAdLocation(adLocationMinX, adLocationMaxX),
      y: getAdLocation(AD_LOCATION_MIN_Y, AD_LOCATION_MAX_Y)
    }
  };
  return adContent;
};

var getAdsContent = function () {
  var adsContent = [];
  for (var i = 0; i < NUMBER_ADS; i += 1) {
    adsContent.push(getAdContent(i));
  }
  return adsContent;
};

var createMark = function (adContent) {
  var mark = markMap.cloneNode(true);

  mark.style.left = adContent.location.x + 'px';
  mark.style.top = adContent.location.y + 'px';
  markImage.src = adContent.author.avatar;
  markImage.alt = adContent.offer.title;

  return mark;
};

var createContainerForMarks = function (adsContent) {
  var conainerForMarks = document.createDocumentFragment();
  adsContent = getAdsContent();

  for (var i = 0; i < adsContent.length; i++) {
    conainerForMarks.appendChild(createMark(adsContent[i]));
  }
  return conainerForMarks;
};

document.querySelector('.map').classList.remove('map--faded');
document.querySelector('.map__pins').appendChild(createContainerForMarks());
