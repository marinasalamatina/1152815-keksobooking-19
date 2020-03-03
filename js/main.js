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

var LEFT_BUTTON_MOUSE = 0;
var MAX_PRICENIGHT = 1000000;

var rectPin = document.querySelector('.map__pin').querySelector('img').getBoundingClientRect();
var imageWidth = rectPin.width;
var imageHeight = rectPin.height;

var map = document.querySelector('.map');
var pin = document.querySelector('#pin');

var mapPin = pin.content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');
var mainPinImage = mapPinMain.querySelector('img');
var rectMainPin = mainPinImage.getBoundingClientRect();
var mapPinMainLeft = rectMainPin.left;
var mapPinMainTop = rectMainPin.top;
var mapPinMainWidth = rectMainPin.width;
var mapPinMainHeight = rectMainPin.height;
var mapPinLocationX = Math.round(mapPinMainLeft + mapPinMainWidth / 2);
var mapPinLocationY = Math.round(mapPinMainTop + mapPinMainHeight);
var mapPinCoordinates = mapPinLocationX + ', ' + mapPinLocationY;

var adForm = document.querySelector('.ad-form');
var adFormAddress = adForm.querySelector('#address');
var adFormRooms = adForm.querySelector('#room_number');
var adFormType = adForm.querySelector('#type');
var adFormPrice = adForm.querySelector('#price');
var adFormCapacity = adForm.querySelector('#capacity');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var adFormCheckout = adForm.querySelector('#timeout');
var adFormCheckin = adForm.querySelector('#timein');
var adFormSubmit = adForm.querySelector('.ad-form__submit');

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
  var pinClone = mapPin.cloneNode(true);
  var pinImage = pinClone.querySelector('img');
  var card = createCard(adContent);

  var pinLocationLeft = adContent.location.x - imageWidth / 2 + 'px';
  var pinLocationTop = adContent.location.y - imageHeight + 'px';

  var openPopup = function () {
    var mapCardCurrentOpen = map.querySelector('.map__card');
    if (mapCardCurrentOpen) {
      map.replaceWith(card, mapCardCurrentOpen);
    }
    map.appendChild(card);
  };

  var onPinCloneMousedown = function () {
    openPopup();
  };

  var onPinCloneEnterPress = function (evt) {
    if (evt.key === 'Enter') {
      openPopup();
    }
  };

  pinClone.style.left = pinLocationLeft;
  pinClone.style.top = pinLocationTop;
  pinImage.src = adContent.author.avatar;
  pinImage.alt = adContent.offer.title;

  pinClone.addEventListener('click', onPinCloneMousedown);
  pinClone.addEventListener('keydown', onPinCloneEnterPress);

  return pinClone;
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
  var mapCard = document.querySelector('#card').content.querySelector('.map__card');
  var card = mapCard.cloneNode(true);
  var priceNight = adContent.offer.price + '₽/ночь';
  var capacityRoomsGuests = adContent.offer.rooms + ' комнаты для ' + adContent.offer.guests + ' гостей';
  var popupDescription = card.querySelector('.popup__description');
  var timesCheckinCheckout = 'Заезд после ' + adContent.offer.checkin + ', выезд до ' + adContent.offer.checkout;
  var popupFeatures = card.querySelector('.popup__features');
  var features = getFeatures(adContent.offer.features);
  var imageFromTemplate = card.querySelector('.popup__photos').querySelector('img');
  var photos = getPhotos(imageFromTemplate, adContent.offer.photos);
  var type = offerTypeList[adContent.offer.type].name;

  var popupClose = card.querySelector('.popup__close');

  var closePopup = function () {
    map.removeChild(card);
  };

  var onPopupMousedown = function () {
    closePopup();
  };

  var onPopupEscPress = function (evt) {
    if (evt.key === 'Escape') {
      closePopup();
    }
  };

  card.querySelector('.popup__title').textContent = adContent.offer.title;
  card.querySelector('.popup__text--address').textContent = adContent.offer.address;
  card.querySelector('.popup__text--price').textContent = priceNight;
  card.querySelector('.popup__type').textContent = type;
  card.querySelector('.popup__text--capacity').textContent = capacityRoomsGuests;
  card.querySelector('.popup__text--time').textContent = timesCheckinCheckout;
  card.removeChild(popupFeatures);
  card.insertBefore(features, popupDescription);
  popupDescription.textContent = adContent.offer.description;
  card.querySelector('.popup__photos').replaceChild(photos, imageFromTemplate);
  card.querySelector('.popup__avatar').src = adContent.author.avatar;

  popupClose.addEventListener('click', onPopupMousedown);
  document.addEventListener('keydown', onPopupEscPress);

  return card;
};

var checkTypeInputValidity = function (customPrice, minPrice) {
  var validityMessageTypeInput = (customPrice < minPrice) ? 'Рекомендуемая цена за ночь от ' + minPrice + ' до ' + MAX_PRICENIGHT : '';

  return validityMessageTypeInput;
};

var checkCapacityInputValidity = function (rooms, guests) {
  var validityMessageCapacityInput = (guests > rooms) || ((guests === 0) !== (rooms === 100)) ? 'Нужно выбрать больше комнат или изменить число гостей' : '';

  return validityMessageCapacityInput;
};

var onMapPinMainMousedown = function (evt) {
  evt.preventDefault();
  if (evt.button === LEFT_BUTTON_MOUSE) {
    activateMap();
  }
};

var onMapPinMainEnterKeydown = function (evt) {
  if (evt.key === 'Enter') {
    activateMap();
  }
};

var onCheckInInputChange = function (evt) {
  adFormCheckout.value = evt.currentTarget.value;
};

var onCheckOutInputChange = function (evt) {
  adFormCheckin.value = evt.currentTarget.value;
};

var onSubmitButtonMousedown = function (evt) {
  var rooms = Number(adFormRooms.value);
  var guests = Number(adFormCapacity.value);
  var minPrice = offerTypeList[adFormType.value].minPrice;
  var customPrice = Number(adFormPrice.value);
  adFormPrice.placeholder = minPrice;

  var validityMessageCapacityInput = checkCapacityInputValidity(rooms, guests);
  adFormCapacity.setCustomValidity(validityMessageCapacityInput);

  var validityMessageTypeInput = checkTypeInputValidity(customPrice, minPrice);
  adFormPrice.setCustomValidity(validityMessageTypeInput);

  if (validityMessageCapacityInput === true || validityMessageTypeInput === true) {
    evt.preventDefault();
  }
};

var deactivateMap = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  adFormFieldsets.forEach(function (fieldset) {
    fieldset.setAttribute('disabled', true);
  });

  mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);
  mapPinMain.addEventListener('keydown', onMapPinMainEnterKeydown);

  adFormAddress.value = mapPinCoordinates;
};

var activateMap = function () {
  mapPins.appendChild(createPins());

  mapPinMain.removeEventListener('keydown', onMapPinMainEnterKeydown);
  mapPinMain.removeEventListener('mousedown', onMapPinMainMousedown);

  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  adFormFieldsets.forEach(function (fieldset) {
    fieldset.removeAttribute('disabled');
  });

  adFormAddress.setAttribute('readonly', '');
  adFormAddress.value = mapPinCoordinates;

  adFormCheckin.addEventListener('change', function () {
    onCheckInInputChange(window.event);
  });

  adFormCheckout.addEventListener('change', function () {
    onCheckOutInputChange(window.event);
  });

  adFormSubmit.addEventListener('click', onSubmitButtonMousedown);
};

deactivateMap();
