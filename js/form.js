'use strict';

(function () {
  var MAX_PRICENIGHT = 1000000;

  var main = document.querySelector('main');
  var adForm = document.querySelector('.ad-form');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormReset = adForm.querySelector('.ad-form__reset');
  var adFormTitle = adForm.querySelector('#title');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAddress = adForm.querySelector('#address');
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
    if (evt.key === 'Escape') {
      removeErrorPopup();
    }
  };

  var removeSuccessMessage = function () {
    successPopup.remove();
    document.removeEventListener('click', onSuccessMessageClick);
    document.removeEventListener('keydown', onSuccessMessageKeyPress);
    adFormAddress.value = window.map.pinLocations;
  };

  var onSuccessMessageClick = function () {
    removeSuccessMessage();
  };

  var onSuccessMessageKeyPress = function (evt) {
    if (evt.key === 'Escape') {
      removeSuccessMessage();
    }
  };

  var displaySuccessPopup = function () {
    document.body.appendChild(successPopup);
    document.addEventListener('click', onSuccessMessageClick);
    document.addEventListener('keydown', onSuccessMessageKeyPress);
    window.map.deactivateMap();
  };

  var displayErrorPopup = function (message) {
    errorMessage.textContent = message;
    main.appendChild(errorPopup);

    errorButton.addEventListener('click', onErrorButtonClick);
    errorButton.addEventListener('keydown', onErrorButtonKeyPress);
    document.addEventListener('keydown', onErrorButtonKeyPress);
  };

  var onAdFormResetClick = function () {
    window.map.deactivateMap();
    var validityMessage = '';
    adFormTitle.setCustomValidity(validityMessage);
    adFormPrice.setCustomValidity(validityMessage);
    adFormType.setCustomValidity(validityMessage);

    adFormReset.removeEventListener('click', onAdFormResetClick);
  };

  var validitePrice = function () {
    var adFormTypeValue = adFormType.value;
    var typeValue = window.card.offerTypeList[adFormTypeValue];
    var minPrice = typeValue.minPrice;
    var customPrice = Number(adFormPrice.value);

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

  var onAdFormSubmitClick = function (evt) {
    var isFormCorrect = validateForm();

    if (isFormCorrect) {
      evt.preventDefault();
      window.backend.save(new FormData(adForm), displaySuccessPopup, displayErrorPopup);
    }
    return;
  };

  var onAdFormCheckInChange = function (evt) {
    adFormCheckout.value = evt.currentTarget.value;
  };

  var onAdFormCheckOutChange = function (evt) {
    adFormCheckin.value = evt.currentTarget.value;
  };

  var deactivateForm = function () {
    adForm.classList.add('ad-form--disabled');
    adFormCheckin.removeEventListener('change', onAdFormCheckInChange);
    adFormCheckout.removeEventListener('change', onAdFormCheckOutChange);
    adForm.removeEventListener('click', onAdFormSubmitClick);
    adFormSubmit.removeEventListener('click', onAdFormSubmitClick);
    window.utils.getBlockElements(adFormFieldsets);
    adForm.reset();
  };

  var activateForm = function () {
    adForm.classList.remove('ad-form--disabled');
    adFormAddress.setAttribute('readonly', '');
    adFormCheckin.addEventListener('change', onAdFormCheckInChange);
    adFormCheckout.addEventListener('change', onAdFormCheckOutChange);
    adForm.addEventListener('click', onAdFormSubmitClick);
    adFormSubmit.addEventListener('click', onAdFormSubmitClick);
    window.utils.getUnblockElements(adFormFieldsets);
    adFormReset.addEventListener('click', onAdFormResetClick);
  };

  window.form = {
    onAdFormSubmitClick: onAdFormSubmitClick,
    deactivateForm: deactivateForm,
    activateForm: activateForm
  };
})();
