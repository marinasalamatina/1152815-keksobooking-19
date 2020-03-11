'use strict';

(function () {
  var MAX_PRICENIGHT = 1000000;

  var adForm = document.querySelector('.ad-form');
  var adFormCheckin = adForm.querySelector('#timein');
  var adFormCheckout = adForm.querySelector('#timeout');
  var adFormPrice = adForm.querySelector('#price');
  var adFormType = adForm.querySelector('#type');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormRooms = adForm.querySelector('#room_number');

  var successPopupTemplate = document.querySelector('#success ').content.querySelector('.success');
  var successPopup = successPopupTemplate.cloneNode(true);

  var windowPopupTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorPopup = windowPopupTemplate.cloneNode(true);
  var errorMessage = errorPopup.querySelector('.error__message');
  var errorButton = errorPopup.querySelector('.error__button');

  var onSuccessMessageClick = function () {
    successPopup.remove();
    document.removeEventListener('click', onSuccessMessageClick);
  };

  var onSuccessMessageEscapePress = function (evt) {
    if (evt.key === 'Escape') {
      successPopup.remove();
      document.removeEventListener('keydown', onSuccessMessageEscapePress);
    }
  };

  var closeErrorWindow = function () {
    errorPopup.remove();

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

  var onCheckInInputChange = function (evt) {
    adFormCheckout.value = evt.currentTarget.value;
  };

  var onCheckOutInputChange = function (evt) {
    adFormCheckin.value = evt.currentTarget.value;
  };

  var validitePrice = function () {
    var typeValue = adFormType.value;
    var minPrice = window.card.offerTypeList[typeValue].minPrice;
    var customPrice = Number(adFormPrice.value);
    adFormPrice.placeholder = minPrice;

    var validityMessagePrice = (customPrice < minPrice) ? 'Рекомендуемая цена за ночь от ' + minPrice + ' до ' + MAX_PRICENIGHT : '';
    adFormPrice.setCustomValidity(validityMessagePrice);

    return validityMessagePrice;
  };

  var validiteCapacity = function () {
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

  var onLoad = function () {
    document.body.appendChild(successPopup);
    document.addEventListener('click', onSuccessMessageClick);
    document.addEventListener('keydown', onSuccessMessageEscapePress);
  };

  var onError = function (message) {
    errorMessage.textContent = message;
    document.body.appendChild(errorPopup);

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
