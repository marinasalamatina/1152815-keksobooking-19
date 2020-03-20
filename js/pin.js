'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');

  var rectPin = document.querySelector('.map__pin').querySelector('img').getBoundingClientRect();
  var imageWidth = rectPin.width;
  var imageHeight = rectPin.height;

  var createPin = function (adContent) {
    var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');
    var pin = mapPin.cloneNode(true);
    var pinImage = pin.querySelector('img');

    var pinLocationLeft = adContent.location.x - imageWidth / 2 + 'px';
    var pinLocationTop = adContent.location.y - imageHeight + 'px';

    var openPopup = function () {
      window.card.createCard(adContent);
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

  var createPins = function (cards) {
    var pins = document.createDocumentFragment();

    cards.forEach(function (element) {
      pins.appendChild(window.pin.createPin(element));
    });

    return pins;
  };

  var setMapPins = function (cards) {
    var pins = createPins(cards.slice(0, window.constants.pinParameters.ADS_NUMBER));
    var pinsWithoutMainPin = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pinsWithoutMainPin) {
      pinsWithoutMainPin.forEach(function (element) {
        mapPins.removeChild(element);
      });
    }
    mapPins.appendChild(pins);
  };

  window.pin = {
    createPin: createPin,
    setMapPins: setMapPins
  };
})();
