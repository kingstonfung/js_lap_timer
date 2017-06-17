import styles from './styles/jsTimer.css'

require('./jsTimerCore.js');
require('./jsTimerUI.js');

((doc, win) => {
  const TOGGLE_EVENT_TRIGGER = 'click';
  const JS_TIMER_SHELL_SELECTOR = '.jsClientTimer';
  const JS_TIMER_SHOW_CLASS = 'show';

  const MAX_LAPS = +doc.currentScript.dataset.maxlaps || 1;
  const APP_SOURCE_ORIGIN = doc.currentScript.dataset.sourceOrigin || '';
  const APP_SOURCE_STYLE = doc.currentScript.dataset.sourceStyle || 'build/styles.css';
  const TOGGLE_BTN_SELECTOR = doc.currentScript.dataset.toggleButtonSelector || '.toggle[data-widget="js-timer"]';

  let toggleBtn;
  let timerShell;

  function getScript(source, callback, failedCallback) {
    if (source.match(/.*css$/g)) {
      const fileref = document.createElement('link');
      fileref.setAttribute('rel', 'stylesheet');
      fileref.setAttribute('type', 'text/css');
      fileref.setAttribute('href', source);
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
      script.src = APP_SOURCE_ORIGIN + APP_SOURCE_STYLE;
    }
  }

  getScript(APP_SOURCE_ORIGIN + APP_SOURCE_STYLE);

  toggleBtn = doc.querySelector(TOGGLE_BTN_SELECTOR);
  if (toggleBtn) toggleBtn.addEventListener(TOGGLE_EVENT_TRIGGER, () => {
    timerShell = doc.querySelector(JS_TIMER_SHELL_SELECTOR);
    timerShell.classList.toggle(JS_TIMER_SHOW_CLASS);
  });
  win.Kingular.clientTimerUIFactory(doc, win.Redux, doc.body, MAX_LAPS);
})(document, window);
