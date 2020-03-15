'use strict';

(function () {
  var main = document.querySelector('main');
  var map = document.querySelector('.map');
  var mapLeft = map.getBoundingClientRect().left;
  var filtersContainer = map.querySelector('.map__filters-container');
  var filters = filtersContainer.querySelectorAll('.map__filter');
  var featuresContainer = filtersContainer.querySelector('.map__features');
  var features = featuresContainer.querySelectorAll('.map__checkbox');
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
  var pinLocationX = Math.round(pinMainLeft + pinMainHalfWidth - mapLeft);
  var pinLocationY = Math.round(pinMainTop + pinMainHeight);
  var pinLocations = pinLocationX + ', ' + pinLocationY;

  var windowPopupTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorPopup = windowPopupTemplate.cloneNode(true);
  var errorMessage = errorPopup.querySelector('.error__message');
  var errorButton = errorPopup.querySelector('.error__button');

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

  var displayErrorPopup = function (message) {
    errorMessage.textContent = message;
    main.appendChild(errorPopup);

    errorButton.addEventListener('click', onErrorButtonClick);
    errorButton.addEventListener('keydown', onErrorButtonKeyPress);
    document.addEventListener('keydown', onErrorButtonKeyPress);
  };

  var onFiltersContainerChange = window.debounce(function (cards) {
    window.card.closePopup();
    window.pin.setMapPins(window.filter.checkFilters(cards));
  });

  var activateFilters = function (cards) {
    window.utils.getBlockElements(features, false);
    window.utils.getBlockElements(filters, false);
    filtersContainer.addEventListener('change', function () {
      onFiltersContainerChange(cards);
    });
  };

  var displayPins = function (cards) {
    activateFilters(cards);
    window.pin.setMapPins(cards);
  };

  var activateMap = function () {
    mapPinMain.removeEventListener('keydown', window.mouse.onPinMainEnterKeydown);
    map.classList.remove('map--faded');
    window.form.activateForm();
    window.backend.load(displayPins, displayErrorPopup);
  };

  var deactivateMap = function () {
    var listMapPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');

    if (listMapPins) {
      listMapPins.forEach(function (element) {
        mapPins.removeChild(element);
      });
    }

    window.utils.getBlockElements(features, true);
    window.utils.getBlockElements(filters, true);

    map.classList.add('map--faded');
    window.form.deactivateForm();

    mapPinMain.addEventListener('mousedown', window.mouse.onPinMainMousedown);
    mapPinMain.addEventListener('keydown', window.mouse.onPinMainEnterKeydown);

    adFormAddress.value = pinLocations;
  };

  deactivateMap();

  window.map = {
    deactivateMap: deactivateMap,
    pinLocations: pinLocations,
    activateMap: activateMap
  };
})();
