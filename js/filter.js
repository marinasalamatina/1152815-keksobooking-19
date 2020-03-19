'use strict';

(function () {
  var filtersContainer = document.querySelector('.map__filters-container');

  var guestsFilter = filtersContainer.querySelector('#housing-guests');
  var roomsFilter = filtersContainer.querySelector('#housing-rooms');
  var priceFilter = filtersContainer.querySelector('#housing-price');
  var typeFilter = filtersContainer.querySelector('#housing-type');
  var mapFilters = filtersContainer.querySelector('.map__filters');

  var filterType = function (card) {
    return ((typeFilter.value === card.offer.type) || (typeFilter.value === 'any')) ? true : false;
  };

  var filterPrice = function (card) {
    switch (priceFilter.value) {
      case 'any':
        return true;
      case 'low':
        return (card.offer.price < window.constants.filterPrice.LOW_PRICE) ? true : false;
      case 'high':
        return (card.offer.price >= window.constants.filterPrice.HIGH_PRICE) ? true : false;
      case 'middle':
        return ((card.offer.price >= window.constants.filterPrice.LOW_PRICE) && (card.offer.price <= window.constants.filterPrice.HIGH_PRICE)) ? true : false;
      default:
        return false;
    }
  };

  var filterRooms = function (card) {
    return ((roomsFilter.value === card.offer.rooms.toString()) || (roomsFilter.value === 'any')) ? true : false;
  };

  var filterGuests = function (card) {
    return ((guestsFilter.value === card.offer.guests.toString()) || (guestsFilter.value === 'any')) ? true : false;
  };

  var filterFeature = function (card) {
    var checkboxesChecked = mapFilters.querySelectorAll('.map__checkbox:checked');
    var featuresChecked = [];

    checkboxesChecked.forEach(function (checkbox) {
      featuresChecked.push(checkbox.value);
    });

    if (featuresChecked.length > 0) {
      return featuresChecked.every(function (feature) {
        return card['offer']['features'].includes(feature);
      });
    }
    return true;
  };

  var validateCard = function (card) {
    return ((filterType(card)) && (filterPrice(card)) && (filterRooms(card)) && (filterGuests(card)) && (filterFeature(card))) ? true : false;
  };

  var checkFilters = function (cards) {
    var filteredCards = [];
    for (var i = 0; i < cards.length; i += 1) {
      var isCardCorrect = validateCard(cards[i]);
      if (isCardCorrect) {
        filteredCards.push(cards[i]);
        if (filteredCards.length > window.constants.pinParameters.ADS_NUMBER) {
          return filteredCards;
        }
      }
    }
    return filteredCards;
  };

  window.filter = {
    checkFilters: checkFilters
  };
})();
