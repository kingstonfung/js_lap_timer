if (typeof kingular_js === 'undefined') kingular_js = {};

kingular_js.clientTimer = (function(doc, ls, r) {
  /*
  TO DO:
    1. Fix scattered clearTimeout
    2. Fix timer reset incorrect timestamp
    3. Lint with Airbnb JS standard
    4. Unit Tests, Build Scripts, Minifications
  */

  const TIMER_TICK = 'TICK';
  const LAP_CAPTURE = 'LAP';
  const TIMER_START = 'START';
  const TIMER_STOP = 'STOP';
  const TIMER_RESET = 'RESET';
  const LOCAL_STORAGE_KEY = 'timer_data';
  const TIMER_UPDATE_INTERVAL = 17; // '60'fps
  const CLICK_EVENT = 'click';

  var startBtn = doc.getElementsByClassName("startTimerButton")[0];
  var stopBtn = doc.getElementsByClassName("stopTimerButton")[0];
  var lapBtn = doc.getElementsByClassName("lapTimerButton")[0];
  var resetBtn = doc.getElementsByClassName("resetButton")[0];
  var timerDisplayElement = doc.getElementsByClassName("timerText")[0];

  var storedState;
  var state = {};
  var timerTimeoutID = -1;

  var getBlankTimerObj = function() {
    return {
      timerStart: +new Date(),
      elapsed: 0,
      laps: [],
      isRunning: false
    };
  };

  var timerClockReducerFunc = function(state, action) {
    if (typeof state === 'undefined') return getBlankTimerObj();
    var timeSinceStart = +new Date() - state.timerStart;
    switch (action.type) {
      case TIMER_START:
        state.isRunning = true;
      case TIMER_TICK:
        state.laps[state.elapsed] = timeSinceStart;
        return state;
      case LAP_CAPTURE:
        state.elapsed++;
        return state;
      case TIMER_STOP:
        state.isRunning = false;
        return state;
      case TIMER_RESET:
        return getBlankTimerObj();
      default:
        return state;
    }
  }

  var updateTimerDOM = function() {
    var s = state.getState();
    var displayStr = "0";
    if (s.laps.length) {
      displayStr = s.laps.map(function(time) {
        return time;
      });
    }
    timerDisplayElement.innerHTML = displayStr;
  };

  var saveToLocalStorage = function(key, data) {
    ls.setItem(key, JSON.stringify(data));
  }

  var loadFromLocalStorage = function(key) {
    return JSON.parse(ls.getItem(key));
  }

  var dispatchStartEvent = function() {
    state.dispatch({ type: TIMER_START });
  }

  var dispatchTickEvent = function() {
    state.dispatch({ type: TIMER_TICK });
  }

  var dispatchLapEvent = function() {
    state.dispatch({ type: LAP_CAPTURE });
  }

  var dispatchStopEvent = function() {
    clearTimeout(timerTimeoutID);
    state.dispatch({ type: TIMER_STOP });
  }

  var dispatchResetEvent = function() {
    if (state.getState().isRunning) dispatchStopEvent();
    state.dispatch({ type: TIMER_RESET });
  }

  var createTimeoutCall = function() {
    return setTimeout(function () {
      dispatchTickEvent();
    }, TIMER_UPDATE_INTERVAL);
  }

  stopBtn.addEventListener(CLICK_EVENT, function() {
    dispatchStopEvent();
  });

  lapBtn.addEventListener(CLICK_EVENT, function() {
    dispatchLapEvent();
  });

  startBtn.addEventListener(CLICK_EVENT, function() {
    dispatchStartEvent();
  });

  resetBtn.addEventListener(CLICK_EVENT, function() {
    dispatchResetEvent();
  });


  storedState = loadFromLocalStorage(LOCAL_STORAGE_KEY) || getBlankTimerObj();
  state = r.createStore(timerClockReducerFunc, storedState);
  updateTimerDOM();
  state.subscribe(function () {
    var s = state.getState();
    updateTimerDOM();
    saveToLocalStorage(LOCAL_STORAGE_KEY, s);
    if (s.isRunning) {
      clearTimeout(timerTimeoutID);
      timerTimeoutID = createTimeoutCall();
    }
  });


  return { // Public APIs
    getTimersOutput: function() {
      return state.getState().laps;
    }
  }

}(document, window.localStorage, Redux));
