/*
TO DO:
  ✓  Fix scattered clearTimeout
  ✓  Fix timer reset incorrect timestamp
  ✓  Lint with Airbnb JS standard
  4. Fix "Stop Timer".
    - The duration between a "stop" and "start" is included right now.
    - Just rename button and methods to "Pause Timer"?
  5. Unit Tests, Build Scripts, Minifications
*/

/* global Redux:true Kingular:true */
if (typeof Kingular === 'undefined' || !Kingular) {
  Kingular = {};
}

Kingular.clientTimerFactory = ((json, ls, r, tickCallback) => {
  const TIMER_TICK = 'TICK';
  const LAP_CAPTURE = 'LAP';
  const TIMER_START = 'START';
  const TIMER_STOP = 'STOP';
  const TIMER_RESET = 'RESET';
  const LOCAL_STORAGE_KEY = 'timer_data';
  const TIMER_UPDATE_INTERVAL = 250;

  let storedState = {};
  let state = {};
  let timerTimeoutID = -1;

  const convertMillisecondsToClockString = (ms) => {
    let x = ms / 1000;
    const seconds = Math.floor(x % 60);
    const secondsStr = `${(seconds < 10) ? '0' : ''}${seconds.toString()}`;
    x /= 60;
    const minutes = Math.floor(x % 60);
    const minutesStr = `${(minutes < 10) ? '0' : ''}${minutes.toString()}`;
    x /= 60;
    const hours = Math.floor(x % 24).toString();
    const hoursStr = `${(hours < 10) ? '0' : ''}${hours.toString()}`;
    x /= 24;
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  };

  const convertLapsToClock = laps => (
    laps.map(lapTime => (
      convertMillisecondsToClockString(lapTime)
    ))
  );

  const getBlankTimerObj = () => ({
    timerStart: +new Date(),
    lapStart: +new Date(),
    lapElapsed: 0,
    totalElapsed: 0,
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
          newAppState.lapStart = +new Date();
        }
        return Object.assign(appState, newAppState);
      },
      [TIMER_TICK]() {
        const lapsCount = appState.lapElapsed;
        const newTime = +new Date() - appState.lapStart;
        const totalTime = +new Date() - appState.timerStart;
        newAppState = {
          laps: appState.laps,
          totalElapsed: totalTime,
        };
        newAppState.laps[lapsCount] = newTime;
        return Object.assign(appState, newAppState);
      },
      [LAP_CAPTURE]() {
        newAppState = {
          lapElapsed: (appState.lapElapsed + 1),
          lapStart: +new Date(),
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

  const saveToLocalStorage = (key, data, localstorage) => {
    localstorage.setItem(key, json.stringify(data));
  };

  const loadFromLocalStorage = key => json.parse(ls.getItem(key));

  const dispatchStartEvent = (currentState = state) => {
    currentState.dispatch({ type: TIMER_START });
    if (typeof tickCallback === 'function') {
      const stateObj = currentState.getState();
      const laps = stateObj.laps;
      const lapStringObject = {
        lapsString: convertLapsToClock(laps),
      };
      tickCallback(Object.assign(stateObj, lapStringObject));
    }
  };

  const dispatchTickEvent = (currentState = state) => {
    currentState.dispatch({ type: TIMER_TICK });
    if (typeof tickCallback === 'function') {
      const stateObj = currentState.getState();
      const laps = stateObj.laps;
      const totalTime = stateObj.totalElapsed;
      const lapStringObject = {
        lapsString: convertLapsToClock(laps),
        totalTimeString: convertMillisecondsToClockString(totalTime),
      };
      tickCallback(Object.assign(stateObj, lapStringObject));
    }
  };

  const dispatchLapEvent = (currentState = state) => {
    currentState.dispatch({ type: LAP_CAPTURE });
    if (typeof tickCallback === 'function') {
      const stateObj = currentState.getState();
      const laps = stateObj.laps;
      const lapStringObject = {
        lapsString: convertLapsToClock(laps),
      };
      tickCallback(Object.assign(stateObj, lapStringObject));
    }
  };

  const dispatchStopEvent = (currentState = state) => {
    currentState.dispatch({ type: TIMER_STOP });
    if (typeof tickCallback === 'function') {
      const stateObj = currentState.getState();
      const laps = stateObj.laps;
      const lapStringObject = {
        lapsString: convertLapsToClock(laps),
      };
      tickCallback(Object.assign(stateObj, lapStringObject));
    }
  };

  const dispatchResetEvent = (currentState = state) => {
    let stateObj = currentState.getState();
    if (stateObj.isRunning) dispatchStopEvent(currentState);
    currentState.dispatch({ type: TIMER_RESET });
    stateObj = currentState.getState();
    if (typeof tickCallback === 'function') {
      const laps = stateObj.laps;
      const lapStringObject = {
        lapsString: convertLapsToClock(laps),
      };
      tickCallback(Object.assign(stateObj, lapStringObject));
    }
  };

  const createTimeoutCall = (currentState = state) => (
    setTimeout(() => {
      dispatchTickEvent(currentState);
    }, TIMER_UPDATE_INTERVAL)
  );

  const getTimerJSONString = (format, timerState) => {
    const client = timerState.laps[0];
    const after = timerState.laps[timerState.laps.length] || timerState.laps[0];
    const total = timerState.totalElapsed;
    const timeData = {
      client: (format === 'clock') ? convertMillisecondsToClockString(client) : client,
      after: (format === 'clock') ? convertMillisecondsToClockString(after) : after,
      total: (format === 'clock') ? convertMillisecondsToClockString(total) : total,
    };
    return json.stringify(timeData); // first lap, last lap, total time
  };

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
    dispatchStartEvent(state);
  } else if (typeof tickCallback === 'function') {
    const lapStringObject = {
      lapsString: convertLapsToClock(state.getState().laps),
    };
    tickCallback(Object.assign(state.getState(), lapStringObject));
  }

  return { // Public APIs
    stopTimer: dispatchStopEvent,
    startTimer: dispatchStartEvent,
    resetTimer: dispatchResetEvent,
    lapTimer: dispatchLapEvent,
    getTimerInfo() {
      return state.getState();
    },
    getStatusJSONString(format = '', timerState = state.getState()) {
      return getTimerJSONString(format, timerState);
    },
    // ConvertToClockStr: convertMillisecondsToClockString,
  };
});
