'use strict';

(function () {
  var MAX_PRICENIGHT = 1000000;

  var adForm = document.querySelector('.ad-form');
  var adFormRooms = adForm.querySelector('#room_number');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormCheckout = adForm.querySelector('#timeout');
  var adFormCheckin = adForm.querySelector('#timein');
  var adFormCapacity = adForm.querySelector('#capacity');
  var windowErrorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success ').content.querySelector('.success');

  var onCheckInInputChange = function (evt) {
    adFormCheckout.value = evt.currentTarget.value;
  };

  var onCheckOutInputChange = function (evt) {
    adFormCheckin.value = evt.currentTarget.value;
  };

  var validitePrice = function () {
    var minPrice = window.card.offerTypeList[adFormType.value].minPrice;
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

  var onError = function (message) {
    var errorWindow = windowErrorTemplate.cloneNode(true);
    var errorMessage = errorWindow.querySelector('.error__message');
    var errorButton = errorWindow.querySelector('.error__button');

    errorButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      document.body.removeChild(errorWindow);
      window.backend.save(new FormData(adForm), onLoad, onError);
    });

    errorMessage.textContent = message;
    document.body.appendChild(errorWindow);
  };

  var onLoad = function () {
    var success = successTemplate.cloneNode(true);

    var onSuccessMessageClick = function () {
      document.body.removeChild(success);
      document.removeEventListener('click', onSuccessMessageClick);
    };

    var onSuccessMessageEsc = function (evt) {
      if (evt.key === 'Escape') {
        document.body.removeChild(success);
        document.removeEventListener('click', onSuccessMessageEsc);
      }
    };

    document.body.appendChild(success);
    document.addEventListener('click', onSuccessMessageClick);
    document.addEventListener('click', onSuccessMessageEsc);
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
