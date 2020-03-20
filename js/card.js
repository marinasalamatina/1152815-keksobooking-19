'use strict';

(function () {
  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');
  var mapCard = document.querySelector('#card').content.querySelector('.map__card');
  var card = mapCard.cloneNode(true);
  var popupClose = card.querySelector('.popup__close');

  var closePopup = function () {
    card.remove();
  };

  var onPopupMousedown = function () {
    closePopup();
  };

  var onPopupEscPress = function (evt) {
    if (evt.key === 'Escape') {
      closePopup();
    }
  };

  var getFeatures = function (features) {
    var featuresListFragment = document.createElement('ul');
    featuresListFragment.classList.add('popup__features');

    for (var i = 0; i < features.length; i += 1) {
      var featuresItemFragment = document.createElement('li');
      featuresItemFragment.classList.add('popup__feature');
      featuresItemFragment.classList.add('popup__feature--' + features[i]);
      featuresListFragment.appendChild(featuresItemFragment);
    }
    return featuresListFragment;
  };

  var getPhotos = function (template, photos) {
    var photosFragment = document.createDocumentFragment();

    for (var i = 0; i < photos.length; i += 1) {
      var photoFragment = template.cloneNode(true);
      photoFragment.src = photos[i];
      photosFragment.appendChild(photoFragment);
    }
    return photosFragment;
  };

  var createCard = function (adContent) {
    var priceNight = adContent.offer.price + '₽/ночь';
    var capacityRoomsGuests = adContent.offer.rooms + ' комнаты для ' + adContent.offer.guests + ' гостей';
    var popupDescription = card.querySelector('.popup__description');
    var timesCheckinCheckout = 'Заезд после ' + adContent.offer.checkin + ', выезд до ' + adContent.offer.checkout;
    var popupFeatures = card.querySelector('.popup__features');
    var features = getFeatures(adContent.offer.features);
    var imageFromTemplate = card.querySelector('.popup__photos').querySelector('img');
    var photos = getPhotos(imageFromTemplate, adContent.offer.photos);
    var type = window.constants.offerTypeList[adContent.offer.type].name;

    card.querySelector('.popup__title').textContent = adContent.offer.title;
    card.querySelector('.popup__text--address').textContent = adContent.offer.address;
    card.querySelector('.popup__text--price').textContent = priceNight;
    card.querySelector('.popup__type').textContent = type;
    card.querySelector('.popup__text--capacity').textContent = capacityRoomsGuests;
    card.querySelector('.popup__text--time').textContent = timesCheckinCheckout;
    card.removeChild(popupFeatures);
    card.insertBefore(features, popupDescription);
    popupDescription.textContent = adContent.offer.description;
    card.querySelector('.popup__photos').replaceChild(photos, imageFromTemplate);
    card.querySelector('.popup__avatar').src = adContent.author.avatar;

    popupClose.addEventListener('click', onPopupMousedown);
    document.addEventListener('keydown', onPopupEscPress);

    var mapCardCurrentOpen = map.querySelector('.map__card');
    if (mapCardCurrentOpen) {
      map.replaceChild(card, mapCardCurrentOpen);
    }
    map.insertBefore(card, filtersContainer);
  };

  window.card = {
    createCard: createCard,
    closePopup: closePopup
  };
})();
