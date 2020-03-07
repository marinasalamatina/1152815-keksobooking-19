'use strict';

(function () {
  var LEFT_BUTTON_MOUSE = 0;
  var ADS_NUMBER = 8;

  var map = document.querySelector('.map');
  var mapLeft = map.getBoundingClientRect().left;
  var mapPins = document.querySelector('.map__pins');

  var adForm = document.querySelector('.ad-form');
  var adFormAddress = adForm.querySelector('#address');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormCheckout = adForm.querySelector('#timeout');
  var adFormCheckin = adForm.querySelector('#timein');

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

  var error = document.querySelector('#error');
  var errorTemplate = error.content.querySelector('.error');
  var errorButton = errorTemplate.querySelector('.error__button');

  var startCoordinates = {
    left: pinMainLeft,
    top: pinMainTop
  };

  var getMainPinCoordinates = function (pinX, pinY) {
    pinLocationX = Math.round(pinX + pinMainHalfWidth);
    pinLocationY = Math.round(pinY + pinMainHeight);

    adFormAddress.value = pinLocationX + ', ' + pinLocationY;
  };

  var removeErrorWindow = function () {
    var errorWindow = document.querySelector('.error');
    if (errorWindow) {
      errorButton.disabled = false;
      errorWindow.parentNode.removeChild(errorWindow);
    }
  };

  var onErrorButtonClick = function (evt) {
    evt.preventDefault();
    errorButton.classList.remove('ad-form--disabled');
    errorButton.setAttribute('disabled', true);
    errorButton.removeEventListener('click', onErrorButtonClick);
    window.backend.load(onSuccess, onError);
  };

  var makeFragment = function (cards, number) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < number; i += 1) {
      fragment.appendChild(window.pin.createPin(cards[i]));
    }
    return fragment;
  };

  var onDocumentMouseMove = function (evtMousemove) {
    evtMousemove.preventDefault();

    var coordinateXRelativeMap = evtMousemove.clientX - mapLeft - pinMainHalfWidth;
    var coordinateYRelativeMap = evtMousemove.clientY - pinMainHalfHeight;

    var shiftMaxMainPin = {
      x: map.clientWidth - pinMainHalfWidth,
      y: window.data.OFFER_ADDRESS_MAX_Y - pinMainHeight
    };

    var shiftMinMainPin = {
      x: window.data.OFFER_ADDRESS_MIN_X - pinMainHalfWidth,
      y: window.data.OFFER_ADDRESS_MIN_Y - pinMainHeight
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

  var onError = function () {
    removeErrorWindow();
    errorButton.addEventListener('click', onErrorButtonClick);
    document.body.appendChild(errorTemplate);
  };

  var onSuccess = function (cards) {
    removeErrorWindow();
    mapPins.appendChild(makeFragment(cards, ADS_NUMBER));
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

    adFormSubmit.addEventListener('click', window.form.onSubmitButtonMousedown);
    window.backend.load(onSuccess, onError);
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

    mapPinMain.addEventListener('mousedown', onPinMainMousedown);
    mapPinMain.addEventListener('keydown', onPinMainEnterKeydown);

    adFormAddress.value = pinLocations;
  };

  deactivateMap();

  window.map = {
    deactivateMap: deactivateMap()
  };
})();
