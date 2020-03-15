'use strict';

(function () {
  var PIN_MAIN_MIN_X = 0;
  var PIN_MAIN_MIN_Y = 130;
  var PIN_MAIN_MAX_Y = 630;

  var LEFT_BUTTON_MOUSE = 0;
  var ADS_NUMBER = 5;

  var map = document.querySelector('.map');
  var mapLeft = map.getBoundingClientRect().left;
  var filtersContainer = map.querySelector('.map__filters-container');
  var mapPins = document.querySelector('.map__pins');

  var adForm = document.querySelector('.ad-form');
  var adFormAddress = adForm.querySelector('#address');

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
    if (evt.key === 'Escape') {
      removeErrorMessage();
    }
  };

  var createPins = function (cards) {
    var pins = document.createDocumentFragment();

    cards.forEach(function (element) {
      pins.appendChild(window.pin.createPin(element));
    });

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
    document.main.appendChild(errorPopup);

    errorButton.addEventListener('click', onErrorButtonClick);
    errorButton.addEventListener('keydown', onErrorButtonKeyPress);
    document.addEventListener('keydown', onErrorButtonKeyPress);
  };

  var setMapPins = function (cards) {
    var pins = createPins(cards.slice(0, ADS_NUMBER));
    var pinsWithoutMainPin = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pinsWithoutMainPin) {
      pinsWithoutMainPin.forEach(function (element) {
        mapPins.removeChild(element);
      });
    }
    mapPins.appendChild(pins);
  };

  var onFiltersContainerChange = window.debounce(function (cards) {
    setMapPins(window.filter.checkFilters(cards));
  });

  var activateFilters = function (cards) {
    filtersContainer.addEventListener('change', function () {
      onFiltersContainerChange(cards);
    });
  };

  var displayPins = function (cards) {
    activateFilters(cards);
    setMapPins(cards);
  };

  var activateMap = function () {
    mapPinMain.removeEventListener('keydown', onPinMainEnterKeydown);
    map.classList.remove('map--faded');
    window.form.activateForm();
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
    var listMapPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');

    if (listMapPins) {
      listMapPins.forEach(function (element) {
        mapPins.removeChild(element);
      });
    }

    map.classList.add('map--faded');
    window.form.deactivateForm();

    mapPinMain.addEventListener('mousedown', onPinMainMousedown);
    mapPinMain.addEventListener('keydown', onPinMainEnterKeydown);

    adFormAddress.value = pinLocations;
  };

  deactivateMap();

  window.map = {
    deactivateMap: deactivateMap,
    pinLocations: pinLocations
  };
})();
