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
  var mapPinMainDoubleHeight = mapPinMainHeight * 2;
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

  var moveObject = function (evt, objectDraggable) {
    var coordinateXRelativeMap = evt.clientX - mapLeft - mapPinMainHalfWidth;
    var coordinateYRelativeMap = evt.clientY - mapPinMainHalfHeight;
    var screenWidth = map.clientWidth;
    var screenHeight = map.clientHeight;

    var objectDraggableMinShift = {
      x: 0,
      y: 0
    };

    var objectDraggableMaxShift = {
      x: screenWidth - mapPinMainWidth,
      y: screenHeight - mapPinMainDoubleHeight
    };

    if (coordinateXRelativeMap <= objectDraggableMinShift.x) {
      startCoordinates.left = objectDraggableMinShift.x;
    } else if (coordinateXRelativeMap >= objectDraggableMaxShift.x) {
      startCoordinates.left = objectDraggableMaxShift.x;
    } else {
      startCoordinates.left = coordinateXRelativeMap;
    }

    if (coordinateYRelativeMap <= objectDraggableMinShift.y) {
      startCoordinates.top = objectDraggableMinShift.y;
    } else if (coordinateYRelativeMap >= objectDraggableMaxShift.y) {
      startCoordinates.top = objectDraggableMaxShift.y;
    } else {
      startCoordinates.top = coordinateYRelativeMap;
    }

    objectDraggable.style.left = startCoordinates.left + 'px';
    objectDraggable.style.top = startCoordinates.top + 'px';

    getMainPinCoordinates(startCoordinates.left, startCoordinates.top);
  };

  var onDocumentMouseMove = function (evtMousemove) {
    evtMousemove.preventDefault();

    moveObject(evtMousemove, mapPinMain);
  };

  var onDocumentMouseUp = function (evtMouseup) {
    evtMouseup.preventDefault();

    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
  };

  var onUploadMousedown = function (evtMousedown) {
    evtMousedown.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  };

  mapPinMain.addEventListener('mousedown', onUploadMousedown);

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
      onCheckInInputChange(window.event);
    });

    adFormCheckout.addEventListener('change', function () {
      onCheckOutInputChange(window.event);
    });

    adFormSubmit.addEventListener('click', window.form.onSubmitButtonMousedown);
  };

  deactivateMap();
})();
