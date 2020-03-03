'use strict';

(function () {
  var LEFT_BUTTON_MOUSE = 0;

  var map = document.querySelector('.map');
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
  var mapPinMainHeight = rectMainPin.height;
  var mapPinLocationX = Math.round(mapPinMainLeft + mapPinMainWidth / 2);
  var mapPinLocationY = Math.round(mapPinMainTop + mapPinMainHeight);
  var mapPinCoordinates = mapPinLocationX + ', ' + mapPinLocationY;

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
    mapPins.appendChild(window.pin.createPins());

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

    adFormSubmit.addEventListener('click', window.form.onSubmitButtonMousedown);
  };

  deactivateMap();
})();
