((doc, win) => {
  const TIMER_CSS = 'app/jsTimer.css';
  const TIMER_CORE_JS = 'app/jsTimerCore.js';
  const TIMER_UI_JS = 'app/jsTimerUI.js';
  const REDUX_JS = 'app/redux.min.js';
  const TOGGLE_BTN_SELECTOR = '.toggle[data-widget="js-timer"]';
  const TOGGLE_EVENT_TRIGGER = 'click';
  const JS_TIMER_SHELL_SELECTOR = '.jsClientTimer';
  const JS_TIMER_SHOW_CLASS = 'show';
  const MAX_LAPS = +doc.currentScript.dataset.maxlaps || 1;
  let toggleBtn;
  let timerShell;

  function getScript(source, callback, failedCallback) {
    if (source.match(/.*css$/g)) {
      const fileref = document.createElement('link');
      fileref.setAttribute('rel', 'stylesheet');
      fileref.setAttribute('type', 'text/css');
      fileref.setAttribute('href', './app/jsTimer.css');
      document.getElementsByTagName('head')[0].appendChild(fileref);
      if (typeof callback !== 'undefined') {
        fileref.onload = () => {
          callback();
        };
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

  if (typeof win.Redux === 'undefined') getScript(REDUX_JS);

  getScript(TIMER_CSS);
  getScript(TIMER_CORE_JS, () => {
    getScript(TIMER_UI_JS, () => {
      toggleBtn = doc.querySelector(TOGGLE_BTN_SELECTOR);
      toggleBtn.addEventListener(TOGGLE_EVENT_TRIGGER, () => {
        timerShell = doc.querySelector(JS_TIMER_SHELL_SELECTOR);
        timerShell.classList.toggle(JS_TIMER_SHOW_CLASS);
      });
      win.Kingular.clientTimerUIFactory(doc, win.Redux, doc.body, MAX_LAPS);
    });
  });
})(document, window);
