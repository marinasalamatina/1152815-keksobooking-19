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

var markMap = document.querySelector('#pin').content.querySelector('.map__pin');
var markImage = document.querySelector('#pin').content.querySelector('img');
var mapCard = document.querySelector('#card').content.querySelector('.map__card');
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');

var offerTypeList = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};

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
      description: getRandomElement(OFFER_DESCRIPTIONS),
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

  var rect = document.querySelector('.map__pin').querySelector('img').getBoundingClientRect();
  var imageWidth = rect.width;
  var imageHeight = rect.height;

  var markLocationLeft = adContent.location.x - imageWidth / 2 + 'px';
  var markLocationTop = adContent.location.y - imageHeight + 'px';

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

var getPhotos = function (template, photos) {
  var photosFragment = document.createDocumentFragment();

  for (var i = 0; i < photos.length; i++) {
    var photoFragment = template.cloneNode(true);
    photoFragment.src = photos[i];
    photosFragment.appendChild(photoFragment);
  }
  return photosFragment;
};

var createCard = function (adContent) {
  var card = mapCard.cloneNode(true);
  var imgFromTemplate = card.querySelector('.popup__photos').querySelector('img');
  var priceNight = adContent.offer.price + '₽/ночь';
  var capacityRoomsGuests = adContent.offer.rooms + ' комнаты для ' + adContent.offer.guests + ' гостей';
  var timesCheckinCheckout = 'Заезд после ' + adContent.offer.checkin + ', выезд до ' + adContent.offer.checkout;
  var photos = getPhotos(imgFromTemplate, adContent.offer.photos);

  card.querySelector('.popup__title').textContent = adContent.offer.title;
  card.querySelector('.popup__text--address').textContent = adContent.offer.address;
  card.querySelector('.popup__text--price').textContent = priceNight;
  card.querySelector('.popup__type').textContent = offerTypeList[adContent.offer.type];
  card.querySelector('.popup__text--capacity').textContent = capacityRoomsGuests;
  card.querySelector('.popup__text--time').textContent = timesCheckinCheckout;
  card.querySelector('.popup__features').textContent = adContent.offer.features;
  card.querySelector('.popup__description').textContent = adContent.offer.description;
  card.querySelector('.popup__photos').replaceChild(photos, imgFromTemplate);
  card.querySelector('.popup__avatar').src = adContent.author.avatar;

  return card;
};

var createCards = function () {
  var adsContent = getAdsContent();
  var cards = document.createDocumentFragment();
  var blockAfterMap = map.querySelector('.map__filters-container');

  map.insertBefore(cards, blockAfterMap);
  cards.appendChild(createCard(adsContent[0]));

  return cards;
};

var setCards = function () {
  var cards = createCards();

  map.classList.remove('map--faded');
  mapPins.appendChild(cards);
  mapPins.appendChild(createMarks());
};

setCards();
