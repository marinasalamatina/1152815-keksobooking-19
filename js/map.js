'use strict';

(function () {
  var PIN_MAIN_MIN_X = 0;
  var PIN_MAIN_MIN_Y = 130;
  var PIN_MAIN_MAX_Y = 630;

  var LEFT_BUTTON_MOUSE = 0;
  var ADS_NUMBER = 8;

  var map = document.querySelector('.map');
  var mapLeft = map.getBoundingClientRect().left;
  var mapPins = document.querySelector('.map__pins');

  var adForm = document.querySelector('.ad-form');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormAddress = adForm.querySelector('#address');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormCheckout = adForm.querySelector('#timeout');
  var adFormCheckin = adForm.querySelector('#timein');

  var listMapPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');

  var mapPinMain = document.querySelector('.map__pin--main');
  var mainPinImage = mapPinMain.querySelector('img');
  var rectMainPin = mainPinImage.getBoundingClientRect();
  var pinMainLeft = rectMainPin.left;
  var pinMainTop = rectMainPin.top;
  var pinMainWidth = rectMainPin.width;
  var pinMainHalfWidth = pinMainWidth / 2;
  var pinMainHeight = rectMainPin.height;
  var pinMainHalfHeight = pinMainHeight / 2;
  var pinLocationX = Math.round(pinMainLeft + pinMainHalfWidth - mapLeft);
  var pinLocationY = Math.round(pinMainTop + pinMainHeight);
  var pinLocations = pinLocationX + ', ' + pinLocationY;

  var windowPopupTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorPopup = windowPopupTemplate.cloneNode(true);
  var errorMessage = errorPopup.querySelector('.error__message');
  var errorButton = errorPopup.querySelector('.error__button');

  var startCoordinates = {
    left: pinMainLeft,
    top: pinMainTop
  };

  var getMainPinCoordinates = function (pinX, pinY) {
    pinLocationX = Math.round(pinX + pinMainHalfWidth);
    pinLocationY = Math.round(pinY + pinMainHeight);

    adFormAddress.value = pinLocationX + ', ' + pinLocationY;
  };

  var removeErrorMessage = function () {
    errorPopup.remove();
    errorButton.removeEventListener('click', onErrorButtonClick);
    errorButton.removeEventListener('keydown', onErrorButtonKeyPress);
    window.backend.load(displayPins, displayErrorPopup);
  };

  var onErrorButtonClick = function () {
    removeErrorMessage();
  };

  var onErrorButtonKeyPress = function (evt) {
    evt.preventDefault();
    if (evt.key === 'Enter' || evt.key === 'Escape') {
      removeErrorMessage();
    }
  };

  var createPins = function (cards, number) {
    var pins = document.createDocumentFragment();

    for (var i = 0; i < number; i += 1) {
      var pin = window.pin.createPin(cards[i]);
      pins.appendChild(pin);
    }
    return pins;
  };

  var onDocumentMouseMove = function (evtMousemove) {
    evtMousemove.preventDefault();

    var coordinateXRelativeMap = evtMousemove.clientX - mapLeft - pinMainHalfWidth;
    var coordinateYRelativeMap = evtMousemove.clientY - pinMainHalfHeight;

    var shiftMaxMainPin = {
      x: map.clientWidth - pinMainHalfWidth,
      y: PIN_MAIN_MAX_Y - pinMainHeight
    };

    var shiftMinMainPin = {
      x: PIN_MAIN_MIN_X - pinMainHalfWidth,
      y: PIN_MAIN_MIN_Y - pinMainHeight
    };

    if (coordinateXRelativeMap <= shiftMinMainPin.x) {
      startCoordinates.left = shiftMinMainPin.x;
    } else if (coordinateXRelativeMap >= shiftMaxMainPin.x) {
      startCoordinates.left = shiftMaxMainPin.x;
    } else {
      startCoordinates.left = coordinateXRelativeMap;
    }

    if (coordinateYRelativeMap <= shiftMinMainPin.y) {
      startCoordinates.top = shiftMinMainPin.y;
    } else if (coordinateYRelativeMap >= shiftMaxMainPin.y) {
      startCoordinates.top = shiftMaxMainPin.y;
    } else {
      startCoordinates.top = coordinateYRelativeMap;
    }

    mapPinMain.style.left = startCoordinates.left + 'px';
    mapPinMain.style.top = startCoordinates.top + 'px';

    getMainPinCoordinates(startCoordinates.left, startCoordinates.top);
  };

  var onDocumentMouseup = function (evtMouseup) {
    evtMouseup.preventDefault();

    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseup);
  };

  var displayErrorPopup = function (message) {
    errorMessage.textContent = message;
    document.body.appendChild(errorPopup);

    errorButton.addEventListener('click', onErrorButtonClick);
    errorButton.addEventListener('keydown', onErrorButtonKeyPress);
    document.addEventListener('keydown', onErrorButtonKeyPress);
  };

  var displayPins = function (cards) {
    var pins = createPins(cards, ADS_NUMBER);
    mapPins.appendChild(pins);
  };

  var activateMap = function () {
    mapPinMain.removeEventListener('keydown', onPinMainEnterKeydown);

    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    adFormFieldsets.forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });

    adFormAddress.setAttribute('readonly', '');
    adFormAddress.value = pinLocations;

    adFormCheckin.addEventListener('change', function () {
      window.form.onCheckInInputChange(window.event);
    });

    adFormCheckout.addEventListener('change', function () {
      window.form.onCheckOutInputChange(window.event);
    });

    adForm.addEventListener('submit', window.form.onAdFormSubmit);
    adFormSubmit.addEventListener('click', window.form.onAdFormSubmit);

    window.backend.load(displayPins, displayErrorPopup);
  };

  var onPinMainMousedown = function (evtMousedown) {
    evtMousedown.preventDefault();
    if (evtMousedown.button === LEFT_BUTTON_MOUSE) {
      if (map.classList.contains('map--faded')) {
        activateMap();
      }
      document.addEventListener('mousemove', onDocumentMouseMove);
      document.addEventListener('mouseup', onDocumentMouseup);
    }
  };

  var onPinMainEnterKeydown = function (evt) {
    if (evt.key === 'Enter') {
      activateMap();
    }
  };

  var deactivateMap = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    adFormFieldsets.forEach(function (fieldset) {
      fieldset.setAttribute('disabled', true);
    });

    if (listMapPins) {
      listMapPins.forEach(function (element) {
        mapPins.removeChild(element);
      });
    }

    mapPinMain.addEventListener('mousedown', onPinMainMousedown);
    mapPinMain.addEventListener('keydown', onPinMainEnterKeydown);

    adForm.removeEventListener('submit', window.form.onAdFormSubmit);
    adFormSubmit.removeEventListener('click', window.form.onAdFormSubmit);

    adFormAddress.value = pinLocations;
  };

  deactivateMap();

  window.map = {
    deactivateMap: deactivateMap
  };
})();
