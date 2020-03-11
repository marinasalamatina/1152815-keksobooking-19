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

  var removeErrorPopup = function () {
    errorPopup.remove();
    errorButton.removeEventListener('click', onErrorButtonClick);
    errorButton.removeEventListener('keydown', onErrorButtonKeyPress);
  };

  var onErrorButtonClick = function () {
    removeErrorPopup();
  };

  var onErrorButtonKeyPress = function (evt) {
    evt.preventDefault();
    if (evt.key === 'Enter' || evt.key === 'Escape') {
      removeErrorPopup();
    }
  };

  var removeSuccessMessage = function () {
    successPopup.remove();
    document.removeEventListener('click', onSuccessMessageClick);
    document.removeEventListener('keydown', onSuccessMessageKeyPress);
  };

  var onSuccessMessageClick = function () {
    removeSuccessMessage();
  };

  var onSuccessMessageKeyPress = function (evt) {
    if (evt.key === 'Enter' || evt.key === 'Escape') {
      removeSuccessMessage();
    }
  };

  var onCheckInInputChange = function (evt) {
    adFormCheckout.value = evt.currentTarget.value;
  };

  var onCheckOutInputChange = function (evt) {
    adFormCheckin.value = evt.currentTarget.value;
  };

  var validitePrice = function () {
    var adFormTypeValue = adFormType.value;
    var typeValue = window.card.offerTypeList[adFormTypeValue];
    var minPrice = typeValue.minPrice;
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
    document.addEventListener('keydown', onSuccessMessageKeyPress);
    window.map.deactivateMap();
  };

  var onError = function (message) {
    errorMessage.textContent = message;
    document.body.appendChild(errorPopup);

    errorButton.addEventListener('click', onErrorButtonClick);
    errorButton.addEventListener('keydown', onErrorButtonKeyPress);
    document.addEventListener('keydown', onErrorButtonKeyPress);
  };

  var onAdFormSubmit = function (evt) {
    var isFormCorrect = validateForm();

    if (isFormCorrect) {
      evt.preventDefault();
      window.backend.save(new FormData(adForm), onLoad, onError);
    }
  };

  window.form = {
    onAdFormSubmit: onAdFormSubmit,
    onCheckInInputChange: onCheckInInputChange,
    onCheckOutInputChange: onCheckOutInputChange
  };
})();
