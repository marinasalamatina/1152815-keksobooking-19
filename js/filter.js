'use strict';

(function () {
  var filtersContainer = document.querySelector('.map__filters-container');

  var guestsFilter = filtersContainer.querySelector('#housing-guests');
  var roomsFilter = filtersContainer.querySelector('#housing-rooms');
  var priceFilter = filtersContainer.querySelector('#housing-price');
  var typeFilter = filtersContainer.querySelector('#housing-type');
  var featuresContainer = filtersContainer.querySelector('.map__features');
  var features = featuresContainer.querySelectorAll('.map__checkbox');

  var filterType = function (card) {
    return ((typeFilter.value === card.offer.type) || (typeFilter.value === 'any')) ? false : true;
  };

  var filterPrice = function (card) {
    switch (priceFilter.value) {
      case 'any':
        return false;
      case 'low':
        return (card.offer.price < window.constants.filterPrice.LOW_PRICE) ? false : true;
      case 'high':
        return (card.offer.price >= window.constants.filterPrice.HIGH_PRICE) ? false : true;
      case 'middle':
        return ((card.offer.price >= window.constants.filterPrice.LOW_PRICE) && (card.offer.price <= window.constants.filterPrice.HIGH_PRICE)) ? false : true;
      default:
        return true;
    }
  };

  var filterGuests = function (card) {
    return ((guestsFilter.value === card.offer.guests) || (guestsFilter.value === 'any')) ? false : true;
  };

  var filterRooms = function (card) {
    return ((roomsFilter.value === card.offer.rooms) || (guestsFilter.value === 'any')) ? false : true;
  };

  var filterFeature = function (card) {
    var featuresChecked = [];
    var featuresFilter = document.querySelector('#housing-features');
    var featuresInputs = Array.from(featuresFilter.querySelectorAll('input'));
    for (var i = 0; i < featuresInputs.length; i += 1) {
      if (featuresInputs[i].checked) {
        featuresChecked.push(featuresInputs[i].value);
      }
    }
    featuresChecked.every(function (elem) {
      var cardFeatures = Array.from(card.offer.features);
      for (var i = 1; i < featuresChecked.length; i += 1) {
        if (cardFeatures[i] === elem) {

        }
      }
       }
      });
    });
  };

  var validateCard = function (card) {
    return ((!filterType(card)) && (!filterPrice(card)) && (!filterRooms(card)) && (!filterGuests(card)) && (!filterFeature(card))) ? false : true;
  };

  var checkFilters = function (cards) {
    var filteredCards = [];
    for (var i = 0; i < cards.length; i += 1) {
      var isCardCorrect = validateCard(cards[i]);
      if (!isCardCorrect) {
        filteredCards.push(cards[i]);
      }
    }
    return filteredCards;
  };

  window.filter = {
    checkFilters: checkFilters
  };
})();
