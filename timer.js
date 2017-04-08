/* global Redux:true Kingular:true */
if (typeof Kingular === 'undefined') {
  Kingular = {};
}

Kingular.clientTimer = ((doc, ls, r) => {
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

  const startBtn = doc.getElementsByClassName('startTimerButton')[0];
  const stopBtn = doc.getElementsByClassName('stopTimerButton')[0];
  const lapBtn = doc.getElementsByClassName('lapTimerButton')[0];
  const resetBtn = doc.getElementsByClassName('resetButton')[0];
  const timerDisplayElement = doc.getElementsByClassName('timerText')[0];

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
    /*
      Favoring object literals over Switch: bit.ly/2ocD6bS
    */
    let fn;
    let newAppState;
    const actionSwitch = {
      [TIMER_START]() {
        newAppState = {
          isRunning: true,
        };
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

  const updateTimerDOM = (s) => {
    const laps = s.laps;
    console.log('laps', laps);
    let displayStr = '0';
    if (laps.length) {
      displayStr = laps.map(time => time);
    }
    timerDisplayElement.innerHTML = displayStr;
  };

  const saveToLocalStorage = (key, data) => {
    ls.setItem(key, JSON.stringify(data));
  };

  const loadFromLocalStorage = key => JSON.parse(ls.getItem(key));

  const dispatchStartEvent = () => {
    state.dispatch({ type: TIMER_START });
  };

  const dispatchTickEvent = () => {
    state.dispatch({ type: TIMER_TICK });
  };

  const dispatchLapEvent = () => {
    state.dispatch({ type: LAP_CAPTURE });
  };

  const dispatchStopEvent = () => {
    clearTimeout(timerTimeoutID);
    state.dispatch({ type: TIMER_STOP });
  };

  const dispatchResetEvent = () => {
    if (state.getState().isRunning) dispatchStopEvent();
    state.dispatch({ type: TIMER_RESET });
  };

  const createTimeoutCall = () => (
    setTimeout(() => {
      dispatchTickEvent();
    }, TIMER_UPDATE_INTERVAL)
  );

  stopBtn.addEventListener(CLICK_EVENT, () => {
    dispatchStopEvent();
  });

  lapBtn.addEventListener(CLICK_EVENT, () => {
    dispatchLapEvent();
  });

  startBtn.addEventListener(CLICK_EVENT, () => {
    dispatchStartEvent();
  });

  resetBtn.addEventListener(CLICK_EVENT, () => {
    dispatchResetEvent();
  });

  storedState = loadFromLocalStorage(LOCAL_STORAGE_KEY) || getBlankTimerObj();
  state = r.createStore(timerClockReducerFunc, storedState);
  updateTimerDOM(state.getState());
  state.subscribe(() => {
    const s = state.getState();
    updateTimerDOM(s);
    saveToLocalStorage(LOCAL_STORAGE_KEY, s);
    if (s.isRunning) {
      clearTimeout(timerTimeoutID);
      timerTimeoutID = createTimeoutCall();
    }
  });

  return { // Public APIs
    getTimersOutput() {
      return state.getState().laps;
    },
    state() {
      return storedState;
    },
  };
})(document, window.localStorage, Redux);
