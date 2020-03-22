'use strict';

(function () {
  var main = document.querySelector('main');
  var windowPopupTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorPopup = windowPopupTemplate.cloneNode(true);
  var errorMessage = errorPopup.querySelector('.error__message');
  var errorButton = errorPopup.querySelector('.error__button');

  var removeErrorPopup = function () {
    errorPopup.remove();
    document.removeEventListener('keydown', onErrorButtonKeyPress);
  };

  var onErrorButtonClick = function () {
    removeErrorPopup();
  };

  var onErrorButtonKeyPress = function (evt) {
    evt.preventDefault();
    if (evt.key === 'Escape') {
      removeErrorPopup();
    }
  };

  var displayErrorPopup = function (message) {
    errorMessage.textContent = message;
    main.appendChild(errorPopup);

    errorButton.addEventListener('click', onErrorButtonClick);
    errorButton.addEventListener('keydown', onErrorButtonKeyPress);
    document.addEventListener('keydown', onErrorButtonKeyPress);
  };

  window.errorPopup = {
    displayErrorPopup: displayErrorPopup,

  };
})();
