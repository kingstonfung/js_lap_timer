{ // ES6 IIFE
  /* global Kingular:true */
  function getScript(source, callback, failedCallback) {
    if (source.match(/.*css$/g)) {
      let fileref = document.createElement("link");
      fileref.setAttribute('rel', 'stylesheet');
      fileref.setAttribute('type', 'text/css');
      fileref.setAttribute('href', './app/jsTimer.css');
      document.getElementsByTagName('head')[0].appendChild(fileref);
      if (typeof callback !== 'undefined') {
        fileref.onload = function (evt) {
          callback();
        }
      }
    } else if (source.match(/.*js$/g)) {
      let script = document.createElement('script');
      const prior = document.getElementsByTagName('script')[0];

      // script.async = 1;
      prior.parentNode.insertBefore(script, prior);
      script.onload = (_v, isAbort) => {
        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
          script.onload = null;
          script.onreadystatechange = null;
          script = undefined;
          if (!isAbort && typeof callback !== 'undefined') {
            callback();
          } else if (isAbort && typeof failedCallback !== 'undefined') {
            failedCallback();
          }
        }
      };
      script.onreadystatechange = script.onload;
      script.src = source;
    }
  }

  getScript('app/jsTimer.css');

  if (typeof Redux === 'undefined') {
    getScript('app/redux.min.js');
  }

  if (typeof Kingular === 'undefined' || typeof Kingular.clientTimer === 'undefined') {
    getScript('app/jsTimerCore.js', () => {
      getScript('app/jsTimerUI.js');
    });
  }
}
