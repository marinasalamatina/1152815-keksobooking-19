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

var ENTER_KEYCODE = 13;
var MAX_PRICENIGHT = 1000000;

var map = document.querySelector('.map');

var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');
var pinImage = document.querySelector('#pin').content.querySelector('img');
var mainPinImage = mapPinMain.querySelector('img');

var adForm = document.querySelector('.ad-form');
var adFormAddress = adForm.querySelector('#address');
var adFormRooms = adForm.querySelector('#room_number');
var adFormType = adForm.querySelector('#type');
var adFormPrice = adForm.querySelector('#price');
var adFormCapacity = adForm.querySelector('#capacity');
var adFormFieldsets = adForm.querySelectorAll('fieldset');

var mapCard = document.querySelector('#card').content.querySelector('.map__card');

var offerTypeList = {
  'bungalo': 'Бунгало',
  'flat': 'Квартира',
  'house': 'Дом',
  'palace': 'Дворец'
};

var minPriceForTypeList = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
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

var createPin = function (adContent) {
  var pin = mapPin.cloneNode(true);

  var rect = document.querySelector('.map__pin').querySelector('img').getBoundingClientRect();
  var imageWidth = rect.width;
  var imageHeight = rect.height;

  var pinLocationLeft = adContent.location.x - imageWidth / 2 + 'px';
  var pinLocationTop = adContent.location.y - imageHeight + 'px';

  pin.style.left = pinLocationLeft;
  pin.style.top = pinLocationTop;
  pinImage.src = adContent.author.avatar;
  pinImage.alt = adContent.offer.title;

  return pin;
};

var createPins = function (adsContent) {
  var pins = document.createDocumentFragment();
  adsContent = getAdsContent();

  for (var i = 0; i < adsContent.length; i += 1) {
    pins.appendChild(createPin(adsContent[i]));
  }
  return pins;
};

var getFeatures = function (features) {
  var featuresListFragment = document.createElement('ul');
  featuresListFragment.classList.add('popup__features');

  for (var i = 0; i < features.length; i += 1) {
    var featuresItemFragment = document.createElement('li');
    featuresItemFragment.classList.add('popup__feature');
    featuresItemFragment.classList.add('popup__feature--' + features[i]);
    featuresListFragment.appendChild(featuresItemFragment);
  }
  return featuresListFragment;
};

var getPhotos = function (template, photos) {
  var photosFragment = document.createDocumentFragment();

  for (var i = 0; i < photos.length; i += 1) {
    var photoFragment = template.cloneNode(true);
    photoFragment.src = photos[i];
    photosFragment.appendChild(photoFragment);
  }
  return photosFragment;
};

var createCard = function (adContent) {
  var card = mapCard.cloneNode(true);
  var priceNight = adContent.offer.price + '₽/ночь';
  var capacityRoomsGuests = adContent.offer.rooms + ' комнаты для ' + adContent.offer.guests + ' гостей';
  var popupDescription = card.querySelector('.popup__description');
  var timesCheckinCheckout = 'Заезд после ' + adContent.offer.checkin + ', выезд до ' + adContent.offer.checkout;
  var popupFeatures = card.querySelector('.popup__features');
  var features = getFeatures(adContent.offer.features);
  var imageFromTemplate = card.querySelector('.popup__photos').querySelector('img');
  var photos = getPhotos(imageFromTemplate, adContent.offer.photos);

  card.querySelector('.popup__title').textContent = adContent.offer.title;
  card.querySelector('.popup__text--address').textContent = adContent.offer.address;
  card.querySelector('.popup__text--price').textContent = priceNight;
  card.querySelector('.popup__type').textContent = offerTypeList[adContent.offer.type];
  card.querySelector('.popup__text--capacity').textContent = capacityRoomsGuests;
  card.querySelector('.popup__text--time').textContent = timesCheckinCheckout;
  card.removeChild(popupFeatures);
  card.insertBefore(features, popupDescription);
  popupDescription.textContent = adContent.offer.description;
  card.querySelector('.popup__photos').replaceChild(photos, imageFromTemplate);
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

  mapPins.appendChild(cards);
  mapPins.appendChild(createPins());
};

var noActiveMap = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');

  getAdFormAddress();

  mapPinMain.addEventListener('mousedown', mapPinMainMousedown);
  mapPinMain.addEventListener('keydown', mainPinEnterKeydown);
  mapPinMain.addEventListener('mousedown', getAdFormAddress);
  mapPinMain.addEventListener('keydown', getAdFormAddress);

  disableElements(adFormFieldsets);
};

var disableElements = function (array) {
  for (var i = 0; i < array.length; i += 1) {
    array[i].setAttribute('disabled', '');
  }
};

var noDisableElements = function (array) {
  for (var i = 0; i < array.length; i += 1) {
    array[i].removeAttribute('disabled');
  }
};


var mapPinMainMousedown = (function (evt) {
  evt.preventDefault();
  if (evt.button === 0) {
    activeMap();
  }
});

var mainPinEnterKeydown = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activeMap();
  }
};

var activeMap = function () {
  setCards();

  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  adFormAddress.setAttribute('readonly', '');
  adFormCapacity.addEventListener('change', adFormRoomsChange);
  adFormRooms.addEventListener('change', adFormRoomsChange);
  adFormType.addEventListener('change', adFormTypeChange);
  adFormPrice.addEventListener('change', adFormTypeChange);

  getAdFormAddress();

  mapPinMain.removeEventListener('keydown', mainPinEnterKeydown);
  mapPinMain.removeEventListener('mousedown', mapPinMainMousedown);
  mapPinMain.removeEventListener('mousedown', getAdFormAddress);
  mapPinMain.removeEventListener('keydown', getAdFormAddress);

  noDisableElements(adFormFieldsets);
};

var adFormRoomsChange = function () {
  var rooms = adFormRooms.value;
  var guests = adFormCapacity.value;

  var validityMessage = (guests > rooms) ? 'Нужно выбрать больше комнат или уменьшить число гостей' : '';

  adFormCapacity.setCustomValidity(validityMessage);
};

var getAdFormAddress = function () {
  var rect = mainPinImage.getBoundingClientRect();
  var mapPinMainLeft = rect.left;
  var mapPinMainTop = rect.top;
  var mapPinMainWidth = rect.width;
  var mapPinMainHeight = rect.height;

  var mapPinLocationX = Math.round(mapPinMainLeft + mapPinMainWidth / 2);
  var mapPinLocationY = Math.round(mapPinMainTop + mapPinMainHeight);
  var mapPinCoordinates = mapPinLocationX + ', ' + mapPinLocationY;

  adFormAddress.value = mapPinCoordinates;
};

var adFormTypeChange = function () {
  var minPrice = minPriceForTypeList[adFormType.value];
  adFormPrice.placeholder = minPrice;

  var validityMessage = (adFormPrice.value < minPrice) ? 'Рекомендуемая цена за ночь от ' + minPrice + ' до ' + MAX_PRICENIGHT : '';

  adFormPrice.setCustomValidity(validityMessage);
};

noActiveMap();
