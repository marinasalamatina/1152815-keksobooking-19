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

var rect = document.querySelector('.map__pin').querySelector('img').getBoundingClientRect();
var IMAGE_WIDTH = rect.width;
var IMAGE_HEIGHT = rect.height;

var markMap = document.querySelector('#pin').content.querySelector('.map__pin');
var markImage = document.querySelector('#pin').content.querySelector('img');

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

var getAdContent = function (adNumber) {
  var adressPositionX = getRandomNumber(OFFER_ADDRESS_MIN_X, OFFER_ADDRESS_MAX_X);
  var adressPositionY = getRandomNumber(OFFER_ADDRESS_MIN_Y, OFFER_ADDRESS_MAX_Y);

  var adContent = {
    author: {
      avatar: 'img/avatars/user0' + adNumber + '.png'
    },
    offer: {
      title: getRandomElement(OFFER_TITLES),
      address: adressPositionX + ',' + ' ' + adressPositionY,
      price: getRandomNumber(OFFER_MIN_PRICE, OFFER_MAX_PRICE),
      type: getRandomElement(OFFER_TYPES),
      rooms: getRandomNumber(OFFER_MIN_ROOMS, OFFER_MAX_ROOMS),
      guests: getRandomNumber(OFFER_MIN_GUESTS, OFFER_MAX_GUESTS),
      checkin: getRandomElement(OFFER_CHECKINS),
      checkout: getRandomElement(OFFER_CHECKOUTS),
      features: getRandomArray(OFFER_FEATURES),
      descriptions: getRandomElement(OFFER_DESCRIPTIONS),
      photos: getRandomArray(OFFER_PHOTOS)
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

var createMark = function (adContent) {
  var mark = markMap.cloneNode(true);
  var markLocationLeft = adContent.location.x - IMAGE_WIDTH / 2 + 'px';
  var markLocationTop = adContent.location.y - IMAGE_HEIGHT + 'px';

  mark.style.left = markLocationLeft;
  mark.style.top = markLocationTop;
  markImage.src = adContent.author.avatar;
  markImage.alt = adContent.offer.title;

  return mark;
};

var createMarks = function (adsContent) {
  var marks = document.createDocumentFragment();
  adsContent = getAdsContent();

  for (var i = 0; i < adsContent.length; i += 1) {
    marks.appendChild(createMark(adsContent[i]));
  }
  return marks;
};

document.querySelector('.map').classList.remove('map--faded');
document.querySelector('.map__pins').appendChild(createMarks());
