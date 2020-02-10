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

var offerMinPrice = 3000;
var offerMaxPrice = 53000;
var offerMinRooms = 1;
var offerMaxRooms = 8;
var offerMinGuests = 1;
var offerMaxGuests = 4;
var offerDescriptions = ['описание1', 'описание2', 'описание3', 'описание4', 'описание5'];

var markMap = document.querySelector('#pin').content.querySelector('.map__pin');
var markImage = document.querySelector('#pin').content.querySelector('img');

var getRandomNumber = function (array) {
  return Math.round(Math.random() * (array.length));
};

var getRandomNumberInterval = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var mixArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = getRandomNumber(array);
    var temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

var getRandomArray = function (dataProvide) {
  var dataProvideMix = mixArray(dataProvide);
  var dataProvideNewLenght = getRandomNumber(dataProvide);
  var dataProvideNewArray = dataProvideMix.slice(0, dataProvideNewLenght.length);
  return dataProvideNewArray;
};

var getAdContent = function (numberSequence) {
  var adressPositionX = getRandomNumberInterval(OFFER_ADDRESS_MIN_X, OFFER_ADDRESS_MAX_X);
  var adressPositionY = getRandomNumberInterval(OFFER_ADDRESS_MIN_Y, OFFER_ADDRESS_MAX_Y);
  var markPositionX = adressPositionX - markImage.width / 2;
  var markPositionY = adressPositionY - markImage.height;

  var adContent = {
    author: {
      avatar: 'img/avatars/user0' + numberSequence + '.png'
    },
    offer: {
      title: OFFER_TITLES[numberSequence],
      address: adressPositionX + ',' + ' ' + adressPositionY,
      price: getRandomNumberInterval(offerMinPrice, offerMaxPrice),
      type: getRandomNumber(OFFER_TYPES),
      rooms: getRandomNumberInterval(offerMinRooms, offerMaxRooms),
      guests: getRandomNumberInterval(offerMinGuests, offerMaxGuests),
      checkin: getRandomNumber(OFFER_CHECKINS),
      checkout: getRandomNumber(OFFER_CHECKOUTS),
      features: getRandomArray(OFFER_FEATURES),
      descriptions: getRandomNumber(offerDescriptions),
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

  mark.style.left = adContent.location.x + 'px';
  mark.style.top = adContent.location.y + 'px';
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
