'use strict';

window.backend = (function () {
  var createXhr = function (xhr, url, type, onLoad, onError) {
    xhr.responseType = 'json';
    xhr.timeout = window.constants.backendParameters.MAX_TIMEOUT;
    xhr.open(type, url);

    xhr.addEventListener('load', function () {
      if (xhr.status === window.constants.backendParameters.SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Код ошибки: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });
  };

  return {
    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      createXhr(xhr, window.constants.backendParameters.SAVE_URL, 'POST', onLoad, onError);
      xhr.send(data);
    },

    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      createXhr(xhr, window.constants.backendParameters.LOAD_URL, 'GET', onLoad, onError);
      xhr.send();
    }
  };
})();
