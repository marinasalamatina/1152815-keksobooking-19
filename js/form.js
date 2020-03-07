'use strict';

(function () {
  var MAX_PRICENIGHT = 1000000;

  var adForm = document.querySelector('.ad-form');

  var successTemplate = document.querySelector('#success ').content.querySelector('.success');
  var success = successTemplate.cloneNode(true);

  var windowErrorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorWindow = windowErrorTemplate.cloneNode(true);

  var onCheckInInputChange = function (evt) {
    var adFormCheckout = adForm.querySelector('#timeout');
    adFormCheckout.value = evt.currentTarget.value;
  };

  var onCheckOutInputChange = function (evt) {
    var adFormCheckin = adForm.querySelector('#timein');
    adFormCheckin.value = evt.currentTarget.value;
  };

  var validitePrice = function () {
    var adFormPrice = adForm.querySelector('#price');
    var adFormType = adForm.querySelector('#type');

    var minPrice = window.card.offerTypeList[adFormType.value].minPrice;
    var customPrice = Number(adFormPrice.value);
    adFormPrice.placeholder = minPrice;

    var validityMessagePrice = (customPrice < minPrice) ? 'Рекомендуемая цена за ночь от ' + minPrice + ' до ' + MAX_PRICENIGHT : '';
    adFormPrice.setCustomValidity(validityMessagePrice);

    return validityMessagePrice;
  };

  var validiteCapacity = function () {
    var adFormCapacity = adForm.querySelector('#capacity');
    var adFormRooms = adForm.querySelector('#room_number');

    var rooms = Number(adFormRooms.value);
    var guests = Number(adFormCapacity.value);

    var validityMessageCapacity = (guests > rooms) || ((guests === 0) !== (rooms === 100)) ? 'Нужно выбрать больше комнат или изменить число гостей' : '';
    adFormCapacity.setCustomValidity(validityMessageCapacity);

    return validityMessageCapacity;
  };

  var validateForm = function () {
    var isValid = (!validiteCapacity()) && (!validitePrice());
    return isValid;
  };

  var onSuccessMessageClick = function () {
    document.body.removeChild(success);
    document.removeEventListener('click', onSuccessMessageClick);
  };

  var onSuccessMessageEscapePress = function (evt) {
    if (evt.key === 'Escape') {
      document.body.removeChild(success);
      document.removeEventListener('keydown', onSuccessMessageEscapePress);
    }
  };

  var closeErrorWindow = function () {
    document.body.removeChild(errorWindow);

    document.removeEventListener('click', onErrorButtonClick);
    document.removeEventListener('keydown', onErrorButtonEscapePress);
  };

  var onErrorButtonClick = function (evt) {
    evt.preventDefault();
    closeErrorWindow();
  };

  var onErrorButtonEscapePress = function (evt) {
    evt.preventDefault();
    if (evt.key === 'Escape') {
      closeErrorWindow();
    }
  };

  var onLoad = function () {
    document.body.appendChild(success);
    document.addEventListener('click', onSuccessMessageClick);
    document.addEventListener('keydown', onSuccessMessageEscapePress);
  };

  var onError = function (message) {
    var errorMessage = errorWindow.querySelector('.error__message');
    var errorButton = errorWindow.querySelector('.error__button');

    errorMessage.textContent = message;
    document.body.appendChild(errorWindow);

    errorButton.addEventListener('click', onErrorButtonClick);
    document.addEventListener('keydown', onErrorButtonEscapePress);
  };

  var onSubmitButtonMousedown = function (evt) {
    var formCorrect = validateForm();

    if (formCorrect) {
      evt.preventDefault();

      window.backend.save(new FormData(adForm), onLoad, onError);
      window.map.deactivateMap();
    }
  };

  window.form = {
    onSubmitButtonMousedown: onSubmitButtonMousedown,
    onCheckInInputChange: onCheckInInputChange,
    onCheckOutInputChange: onCheckOutInputChange
  };
})();
