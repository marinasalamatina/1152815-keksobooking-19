'use strict';

(function () {
  var map = document.querySelector('.map');

  var adForm = document.querySelector('.ad-form');
  var adFormAddress = adForm.querySelector('#address');

  var mapPinMain = document.querySelector('.map__pin--main');
  var mapLeft = map.getBoundingClientRect().left;
  var mainPinImage = mapPinMain.querySelector('img');
  var rectMainPin = mainPinImage.getBoundingClientRect();
  var pinMainLeft = rectMainPin.left;
  var pinMainTop = rectMainPin.top;
  var pinMainWidth = rectMainPin.width;
  var pinMainHalfWidth = pinMainWidth / 2;
  var pinMainHeight = rectMainPin.height;
  var pinMainHalfHeight = pinMainHeight / 2;
  var startCoordinates = {
    left: pinMainLeft,
    top: pinMainTop
  };

  var getMainPinCoordinates = function (pinX, pinY) {
    var pinLocationX = Math.round(pinX + pinMainHalfWidth);
    var pinLocationY = Math.round(pinY + pinMainHeight);

    adFormAddress.value = pinLocationX + ', ' + pinLocationY;
  };

  var onDocumentMouseMove = function (evtMousemove) {
    evtMousemove.preventDefault();

    var coordinateXRelativeMap = evtMousemove.clientX - mapLeft - pinMainHalfWidth;
    var coordinateYRelativeMap = evtMousemove.clientY - pinMainHalfHeight;

    var shiftMaxMainPin = {
      x: map.clientWidth - pinMainHalfWidth,
      y: window.constants.pinParameters.PIN_MAIN_MAX_Y - pinMainHeight
    };

    var shiftMinMainPin = {
      x: window.constants.pinParameters.PIN_MAIN_MIN_X - pinMainHalfWidth,
      y: window.constants.pinParameters.PIN_MAIN_MIN_Y - pinMainHeight
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

  var onPinMainMousedown = function (evtMousedown) {
    evtMousedown.preventDefault();
    if (evtMousedown.button === window.constants.LEFT_BUTTON_MOUSE) {
      if (map.classList.contains('map--faded')) {
        window.map.activateMap();
      }
      document.addEventListener('mousemove', onDocumentMouseMove);
      document.addEventListener('mouseup', onDocumentMouseup);
    }
  };

  var onPinMainEnterKeydown = function (evt) {
    if (evt.key === 'Enter') {
      window.map.activateMap();
    }
  };

  window.mouse = {
    getMainPinCoordinates: getMainPinCoordinates,
    onPinMainMousedown: onPinMainMousedown,
    onPinMainEnterKeydown: onPinMainEnterKeydown
  };
})();
