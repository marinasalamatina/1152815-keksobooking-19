'use strict';

(function () {
  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');

  var rectPin = document.querySelector('.map__pin').querySelector('img').getBoundingClientRect();
  var imageWidth = rectPin.width;
  var imageHeight = rectPin.height;

  var createPin = function (adContent) {
    var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');
    var pin = mapPin.cloneNode(true);
    var pinImage = pin.querySelector('img');
    var card = window.card.createCard(adContent);

    var pinLocationLeft = adContent.location.x - imageWidth / 2 + 'px';
    var pinLocationTop = adContent.location.y - imageHeight + 'px';

    var openPopup = function () {
      var mapCardCurrentOpen = map.querySelector('.map__card');
      if (mapCardCurrentOpen) {
        map.replaceChild(card, mapCardCurrentOpen);
      }
      map.insertBefore(card, filtersContainer);
    };

    var onPinCloneMousedown = function () {
      openPopup();
    };

    var onPinCloneEnterPress = function (evt) {
      if (evt.key === 'Enter') {
        openPopup();
      }
    };

    pin.style.left = pinLocationLeft;
    pin.style.top = pinLocationTop;
    pinImage.src = adContent.author.avatar;
    pinImage.alt = adContent.offer.title;

    pin.addEventListener('click', onPinCloneMousedown);
    pin.addEventListener('keydown', onPinCloneEnterPress);

    return pin;
  };

  window.pin = {
    createPin: createPin
  };
})();
