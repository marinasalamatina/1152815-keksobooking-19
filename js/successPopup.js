'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormAddress = adForm.querySelector('#address');

  var successPopupTemplate = document.querySelector('#success ').content.querySelector('.success');
  var successPopup = successPopupTemplate.cloneNode(true);

  var removeSuccessMessage = function () {
    successPopup.remove();
    document.removeEventListener('click', onSuccessMessageClick);
    document.removeEventListener('keydown', onSuccessMessageKeyPress);
    adFormAddress.value = window.map.pinLocations;
  };

  var onSuccessMessageClick = function () {
    removeSuccessMessage();
  };

  var onSuccessMessageKeyPress = function (evt) {
    if (evt.key === 'Escape') {
      removeSuccessMessage();
    }
  };

  var displaySuccessPopup = function () {
    window.card.closePopup();
    window.form.resetFormAndFilters();
    document.body.appendChild(successPopup);
    document.addEventListener('click', onSuccessMessageClick);
    document.addEventListener('keydown', onSuccessMessageKeyPress);
    window.map.deactivateMap();
  };

  window.successPopup = {
    displaySuccessPopup: displaySuccessPopup
  };
})();
