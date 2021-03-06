'use strict';

(function () {
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

  var filtersContainer = document.querySelector('.map__filters-container');
  var featuresContainer = filtersContainer.querySelector('.map__features');
  var filtersAll = filtersContainer.querySelectorAll('.map__filter');
  var featuresAll = featuresContainer.querySelectorAll('.map__checkbox');

  var onAdFormCheckInChange = function (evt) {
    adFormCheckout.value = evt.currentTarget.value;
  };

  var onAdFormCheckOutChange = function (evt) {
    adFormCheckin.value = evt.currentTarget.value;
  };

  var resetFormAndFilters = function () {
    var validityMessage = '';
    window.map.deactivateMap();
    adFormTitle.setCustomValidity(validityMessage);
    adFormPrice.setCustomValidity(validityMessage);
    adFormType.setCustomValidity(validityMessage);
    filtersAll.forEach(function (element) {
      element.value = 'any';
    });
    featuresAll.forEach(function (element) {
      element.checked = false;
    });
    window.card.closePopup();
  };

  var onAdFormResetClick = function () {
    resetFormAndFilters();
    adFormReset.removeEventListener('click', onAdFormResetClick);
  };

  var validitePrice = function () {
    var adFormTypeValue = adFormType.value;
    var typeValue = window.constants.offerTypeList[adFormTypeValue];
    var minPrice = typeValue.minPrice;
    var customPrice = Number(adFormPrice.value);

    var validityMessagePrice = (customPrice < minPrice) ? 'Рекомендуемая цена за ночь от ' + minPrice + ' до ' + window.constants.adParameters.MAX_PRICENIGHT : '';
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

  var sendForm = function (evt) {
    var isFormCorrect = validateForm();

    if (isFormCorrect) {
      evt.preventDefault();
      window.backend.save(new FormData(adForm), window.successPopup.displaySuccessPopup, window.errorPopup.displayErrorPopup);
    }
    return;
  };

  var onAdFormSubmitKeydown = function (evt) {
    if (evt.key === 'Enter') {
      sendForm(evt);
    }
  };

  var onAdFormSubmitClick = function (evt) {
    sendForm(evt);
  };

  var deactivateForm = function () {
    adForm.classList.add('ad-form--disabled');
    adFormCheckin.removeEventListener('change', onAdFormCheckInChange);
    adFormCheckout.removeEventListener('change', onAdFormCheckOutChange);
    adForm.removeEventListener('click', onAdFormSubmitKeydown);
    adFormSubmit.removeEventListener('click', onAdFormSubmitClick);
    window.utils.getBlockElements(adFormFieldsets, true);
    adForm.reset();
  };

  var activateForm = function () {
    adForm.classList.remove('ad-form--disabled');
    adFormAddress.setAttribute('readonly', '');
    adFormCheckin.addEventListener('change', onAdFormCheckInChange);
    adFormCheckout.addEventListener('change', onAdFormCheckOutChange);
    adForm.addEventListener('keydown', onAdFormSubmitKeydown);
    adFormSubmit.addEventListener('click', onAdFormSubmitClick);
    adFormReset.addEventListener('click', onAdFormResetClick);
    window.utils.getBlockElements(adFormFieldsets, false);
  };

  window.form = {
    resetFormAndFilters: resetFormAndFilters,
    onAdFormSubmitClick: onAdFormSubmitClick,
    deactivateForm: deactivateForm,
    activateForm: activateForm
  };
})();
