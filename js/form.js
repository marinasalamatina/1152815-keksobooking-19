'use strict';

(function () {
  var MAX_PRICENIGHT = 1000000;

  var adForm = document.querySelector('.ad-form');
  var adFormRooms = adForm.querySelector('#room_number');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormCapacity = adForm.querySelector('#capacity');

  var validitePrice = function (customPrice, minPrice) {
    var validityMessageTypeInput = (customPrice < minPrice) ? 'Рекомендуемая цена за ночь от ' + minPrice + ' до ' + MAX_PRICENIGHT : '';

    return validityMessageTypeInput;
  };

  var validiteCapacity = function (rooms, guests) {
    var validityMessageCapacityInput = (guests > rooms) || ((guests === 0) !== (rooms === 100)) ? 'Нужно выбрать больше комнат или изменить число гостей' : '';

    return validityMessageCapacityInput;
  };

  var onSubmitButtonMousedown = function (evt) {
    var rooms = Number(adFormRooms.value);
    var guests = Number(adFormCapacity.value);
    var minPrice = window.card.offerTypeList[adFormType.value].minPrice;
    var customPrice = Number(adFormPrice.value);
    adFormPrice.placeholder = minPrice;

    var validityMessageCapacity = validiteCapacity(rooms, guests);
    adFormCapacity.setCustomValidity(validityMessageCapacity);

    var validityMessagePrice = validitePrice(customPrice, minPrice);
    adFormPrice.setCustomValidity(validityMessagePrice);

    if (validityMessageCapacity === true || validityMessagePrice === true) {
      evt.preventDefault();
    }
  };

  window.form = {
    onSubmitButtonMousedown: onSubmitButtonMousedown
  };
})();
