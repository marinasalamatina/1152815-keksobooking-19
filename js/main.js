'use strict';

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

var IMAGE_WIDTH = document.querySelector('#pin').content.querySelector('img').width;
var IMAGE_HEIGHT = document.querySelector('#pin').content.querySelector('img').height;

var markMap = document.querySelector('#pin').content.querySelector('.map__pin');
var markImage = document.querySelector('#pin').content.querySelector('img');

var getRandomNumber = function (array) {
  return Math.round(Math.random() * (array.length - 1));
};

var getRandomElement = function (array) {
  return array[getRandomNumber(array)];
};

var getRandomNumberInterval = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var mixedArray = function (array) {
  for (var i = array.length - 1; i > 0; i -= 1) {
    var j = getRandomNumber(array);
    var temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

var getRandomArray = function (array) {
  var dataProvideMix = mixedArray(array);
  var elementsCount = getRandomNumber(array);
  return dataProvideMix.slice(0, elementsCount);
};

var getAdContent = function (adNumber) {
  var adressPositionX = getRandomNumberInterval(OFFER_ADDRESS_MIN_X, OFFER_ADDRESS_MAX_X);
  var adressPositionY = getRandomNumberInterval(OFFER_ADDRESS_MIN_Y, OFFER_ADDRESS_MAX_Y);
  var markPositionX = adressPositionX - IMAGE_WIDTH / 2;
  var markPositionY = adressPositionY - IMAGE_HEIGHT;

  var adContent = {
    author: {
      avatar: 'img/avatars/user0' + adNumber + '.png'
    },
    offer: {
      title: OFFER_TITLES[adNumber],
      address: adressPositionX + ',' + ' ' + adressPositionY,
      price: getRandomNumberInterval(OFFER_MIN_PRICE, OFFER_MAX_PRICE),
      type: getRandomElement(OFFER_TYPES),
      rooms: getRandomNumberInterval(OFFER_MIN_ROOMS, OFFER_MAX_ROOMS),
      guests: getRandomNumberInterval(OFFER_MIN_GUESTS, OFFER_MAX_GUESTS),
      checkin: getRandomElement(OFFER_CHECKINS),
      checkout: getRandomElement(OFFER_CHECKOUTS),
      features: getRandomArray(OFFER_FEATURES),
      descriptions: getRandomElement(OFFER_DESCRIPTIONS),
      photos: getRandomArray(OFFER_PHOTOS)
    },
    location: {
      x: markPositionX,
      y: markPositionY
    }
  };
  return adContent;
};

var getAdsContent = function () {
  var adsContent = [];
  for (var i = 0; i < ADS_NUMBER; i += 1) {
    adsContent.push(getAdContent(i));
  }
  return adsContent;
};

var createMark = function (adContent) {
  var mark = markMap.cloneNode(true);
  var markLocationLeft = adContent.location.x + 'px';
  var markLocationTop = adContent.location.y + 'px';

  mark.style.left = markLocationLeft;
  mark.style.top = markLocationTop;
  markImage.src = adContent.author.avatar;
  markImage.alt = adContent.offer.title;

  return mark;
};

var createMarks = function (adsContent) {
  var marks = document.createDocumentFragment();
  adsContent = getAdsContent();

  for (var i = 0; i < adsContent.length; i++) {
    marks.appendChild(createMark(adsContent[i]));
  }
  return marks;
};

document.querySelector('.map').classList.remove('map--faded');
document.querySelector('.map__pins').appendChild(createMarks());
