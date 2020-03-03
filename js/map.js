'use strict';

(function () {
  var LEFT_BUTTON_MOUSE = 0;

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
  var mapPinMainLeft = rectMainPin.left;
  var mapPinMainTop = rectMainPin.top;
  var mapPinMainWidth = rectMainPin.width;
  var mapPinMainHalfWidth = mapPinMainWidth / 2;
  var mapPinMainHeight = rectMainPin.height;
  var mapPinMainHalfHeight = mapPinMainHeight / 2;
  var mapPinLocationX = Math.round(mapPinMainLeft + mapPinMainHalfWidth - mapLeft);
  var mapPinLocationY = Math.round(mapPinMainTop + mapPinMainHeight);
  var mapPinLocations = mapPinLocationX + ', ' + mapPinLocationY;

  var startCoordinates = {
    left: mapPinMainLeft,
    top: mapPinMainTop
  };

  var getMainPinCoordinates = function (pinX, pinY) {
    mapPinLocationX = Math.round(pinX + mapPinMainHalfWidth);
    mapPinLocationY = Math.round(pinY + mapPinMainHeight);

    adFormAddress.value = mapPinLocationX + ', ' + mapPinLocationY;
  };

  var onDocumentMouseMove = function (evtMousemove) {
    evtMousemove.preventDefault();

    var coordinateXRelativeMap = evtMousemove.clientX - mapLeft - mapPinMainHalfWidth;
    var coordinateYRelativeMap = evtMousemove.clientY - mapPinMainHalfHeight;

    var shiftMaxMainPin = {
      x: map.clientWidth - mapPinMainHalfWidth,
      y: window.data.OFFER_ADDRESS_MAX_Y - mapPinMainHeight
    };

    var shiftMinMainPin = {
      x: window.data.OFFER_ADDRESS_MIN_X - mapPinMainHalfWidth,
      y: window.data.OFFER_ADDRESS_MIN_Y - mapPinMainHeight
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

  var onMainPinMousedown = function (evtMousedown) {
    evtMousedown.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseup);
  };

  mapPinMain.addEventListener('mousedown', onMainPinMousedown);

  var deactivateMap = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    adFormFieldsets.forEach(function (fieldset) {
      fieldset.setAttribute('disabled', true);
    });

    mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);
    mapPinMain.addEventListener('keydown', onMapPinMainEnterKeydown);

    adFormAddress.value = mapPinLocations;
  };

  var activateMap = function () {
    mapPins.appendChild(window.pin.createPins());

    mapPinMain.removeEventListener('keydown', onMapPinMainEnterKeydown);
    mapPinMain.removeEventListener('mousedown', onMapPinMainMousedown);

    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    adFormFieldsets.forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });

    adFormAddress.setAttribute('readonly', '');
    adFormAddress.value = mapPinLocations;

    adFormCheckin.addEventListener('change', function () {
      window.form.onCheckInInputChange(window.event);
    });

    adFormCheckout.addEventListener('change', function () {
      window.form.onCheckOutInputChange(window.event);
    });

    adFormSubmit.addEventListener('click', window.form.onSubmitButtonMousedown);
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

  deactivateMap();
})();
