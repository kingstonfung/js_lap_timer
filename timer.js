/* global Redux:true Kingular:true */
if (typeof Kingular === 'undefined' || !Kingular) {
  Kingular = {};
}

Kingular.clientTimer = ((ls, r, tickCallback) => {
  /*
  TO DO:
    ✓  Fix scattered clearTimeout
    ✓  Fix timer reset incorrect timestamp
    ✓  Lint with Airbnb JS standard
    4. Unit Tests, Build Scripts, Minifications
  */

  const TIMER_TICK = 'TICK';
  const LAP_CAPTURE = 'LAP';
  const TIMER_START = 'START';
  const TIMER_STOP = 'STOP';
  const TIMER_RESET = 'RESET';
  const LOCAL_STORAGE_KEY = 'timer_data';
  const TIMER_UPDATE_INTERVAL = 17; // '60'fps

  let storedState = {};
  let state = {};
  let timerTimeoutID = -1;

  const getBlankTimerObj = () => ({
    timerStart: +new Date(),
    elapsed: 0,
    laps: [],
    isRunning: false,
  });

  const timerClockReducerFunc = (appState, action) => {
    // Favoring object literals over Switch bit.ly/2ocD6bS
    let fn;
    let newAppState;
    const actionSwitch = {
      [TIMER_START]() {
        newAppState = {
          isRunning: true,
        };
        if (appState.laps.length === 0) {
          newAppState.timerStart = +new Date();
        }
        return Object.assign(appState, newAppState);
      },
      [TIMER_TICK]() {
        const lapsCount = appState.elapsed;
        const newTime = +new Date() - appState.timerStart;
        newAppState = {
          laps: appState.laps,
        };
        newAppState.laps[lapsCount] = newTime;
        return Object.assign(appState, newAppState);
      },
      [LAP_CAPTURE]() {
        newAppState = {
          elapsed: (appState.elapsed + 1),
        };
        return Object.assign(appState, newAppState);
      },
      [TIMER_STOP]() {
        newAppState = {
          isRunning: false,
        };
        return Object.assign(appState, newAppState);
      },
      [TIMER_RESET]() {
        return getBlankTimerObj();
      },
    };
    if (actionSwitch[action.type]) {
      fn = actionSwitch[action.type];
    } else {
      fn = () => (appState);
    }
    return fn();
  };

  /*
  const getTimerOutput = (s) => {
    const laps = s.laps;
    let displayStr = '0';
    if (laps.length) {
      displayStr = laps.map(time => time);
    }
    return displayStr;
  };
  */

  const saveToLocalStorage = (key, data, localstorage) => {
    localstorage.setItem(key, JSON.stringify(data));
  };

  const loadFromLocalStorage = key => JSON.parse(ls.getItem(key));

  const dispatchStartEvent = () => {
    state.dispatch({ type: TIMER_START });
    if (typeof tickCallback === 'function') {
      tickCallback(state.getState());
    }
  };

  const dispatchTickEvent = () => {
    state.dispatch({ type: TIMER_TICK });
    if (typeof tickCallback === 'function') {
      tickCallback(state.getState());
    }
  };

  const dispatchLapEvent = () => {
    state.dispatch({ type: LAP_CAPTURE });
    if (typeof tickCallback === 'function') {
      tickCallback(state.getState());
    }
  };

  const dispatchStopEvent = () => {
    state.dispatch({ type: TIMER_STOP });
    if (typeof tickCallback === 'function') {
      tickCallback(state.getState());
    }
  };

  const dispatchResetEvent = () => {
    if (state.getState().isRunning) dispatchStopEvent();
    state.dispatch({ type: TIMER_RESET });
    if (typeof tickCallback === 'function') {
      tickCallback(state.getState());
    }
  };

  const createTimeoutCall = () => (
    setTimeout(() => {
      dispatchTickEvent();
    }, TIMER_UPDATE_INTERVAL)
  );

  // Init scripts
  storedState = loadFromLocalStorage(LOCAL_STORAGE_KEY) || getBlankTimerObj();
  state = r.createStore(timerClockReducerFunc, storedState);
  state.subscribe(() => {
    const s = state.getState();
    saveToLocalStorage(LOCAL_STORAGE_KEY, s, ls);
    clearTimeout(timerTimeoutID);
    if (s.isRunning) {
      timerTimeoutID = createTimeoutCall();
    } else {
      timerTimeoutID = -1;
    }
  });
  if (state.getState().isRunning === true) {
    dispatchStartEvent();
  } else if (typeof tickCallback === 'function') {
    tickCallback(state.getState());
  }

  return { // Public APIs
    stopTimer: dispatchStopEvent,
    startTimer: dispatchStartEvent,
    resetTimer: dispatchResetEvent,
    lapTimer: dispatchLapEvent,
    getTimerInfo() {
      return state.getState();
    },
  };
});
