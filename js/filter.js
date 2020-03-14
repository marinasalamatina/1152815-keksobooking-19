'use strict';

(function () {
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var filtersContainer = document.querySelector('.map__filters-container');

  var guestsFilter = filtersContainer.querySelector('#housing-guests');
  var roomsFilter = filtersContainer.querySelector('#housing-rooms');
  var priceFilter = filtersContainer.querySelector('#housing-price');
  var typeFilter = filtersContainer.querySelector('#housing-type');
  var featuresContainer = filtersContainer.querySelector('.map__features');
  var features = featuresContainer.querySelectorAll('.map__checkbox');

  var filterByType = function (cards, filter) {
    return filter.value === 'any' ? cards : cards.filter(function (element) {
      return filter.value === element.offer.type;
    });
  };

  var filterByPrice = function (cards, filter) {
    return filter.value === 'any' ? cards : cards.filter(function (card) {
      switch (filter.value) {
        case 'low':
          return card.offer.price < LOW_PRICE;
        case 'high':
          return card.offer.price >= HIGH_PRICE;
        case 'middle':
          return (card.offer.price >= LOW_PRICE) && (card.offer.price <= HIGH_PRICE);
        default:
          return true;
      }
    });
  };

  var filterByRooms = function (cards, filter) {
    return filter.value === 'any' ? cards : cards.filter(function (card) {
      return filter.value === card.offer.rooms + '';
    });
  };

  var filterByGuests = function (cards, filter) {
    return filter.value === 'any' ? cards : cards.filter(function (card) {
      return filter.value === card.offer.guests + '';
    });
  };

  var filterByFeature = function (cards, checkbox) {
    return checkbox.checked === false ? cards : cards.filter(function (card) {
      return card.offer.features.indexOf(checkbox.value) !== -1;
    });
  };

  var filterByFeatures = function (cards, checkbox) {
    var filteredCards = cards;
    checkbox.forEach(function (element) {
      filteredCards = filterByFeature(filteredCards, element);
    });
    return filteredCards;
  };

  var checkFilters = function (cards) {
    var filteredAds = filterByGuests(cards, guestsFilter);
    filteredAds = filterByRooms(filteredAds, roomsFilter);
    filteredAds = filterByPrice(filteredAds, priceFilter);
    filteredAds = filterByType(filteredAds, typeFilter);
    filteredAds = filterByFeatures(filteredAds, features);
    return filteredAds;
  };

  window.filter = {
    checkFilters: checkFilters
  };
})();
