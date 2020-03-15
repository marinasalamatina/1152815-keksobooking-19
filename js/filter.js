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

  var filterType = function (cards, filter) {
    return filter.value === 'any' ? cards : cards.filter(function (element) {
      return filter.value === element.offer.type;
    });
  };

  var filterPrice = function (cards, filter) {
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

  var filterRooms = function (cards, filter) {
    return filter.value === 'any' ? cards : cards.filter(function (card) {
      return filter.value === card.offer.rooms + '';
    });
  };

  var filterGuests = function (cards, filter) {
    return filter.value === 'any' ? cards : cards.filter(function (card) {
      return filter.value === card.offer.guests + '';
    });
  };

  var filterFeature = function (cards, checkbox) {
    return checkbox.checked === false ? cards : cards.filter(function (card) {
      return card.offer.features.indexOf(checkbox.value) !== -1;
    });
  };

  var filterFeatures = function (cards, checkbox) {
    checkbox.forEach(function (element) {
      cards = filterFeature(cards, element);
    });
    return cards;
  };

  var checkFilters = function (cards) {
    var filteredCards = filterGuests(cards, guestsFilter);

    filteredCards = filterRooms(filteredCards, roomsFilter);
    filteredCards = filterPrice(filteredCards, priceFilter);
    filteredCards = filterType(filteredCards, typeFilter);
    filteredCards = filterFeatures(filteredCards, features);

    return filteredCards;
  };

  window.filter = {
    checkFilters: checkFilters
  };
})();
