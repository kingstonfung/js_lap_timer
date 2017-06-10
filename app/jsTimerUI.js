((win) => {
  const uiInternals = (doc, redux, anchorElement, maxLaps) => {
    anchorElement.insertAdjacentHTML('beforeend', `
      <div class="jsClientTimer">
        <span class="lineBreak">
          Client Interaction: <div class="timerText">00:00:00</div>
        </span>
        <button class="startTimerButton">Start Both Timer</button>
        <button class="lapTimerButton"><!--Lap-->Stop Client Timer</button>
        <span class="lineBreak">
          After Interaction: <div class="totalTimeText">00:00:00</div>
        </span>
        <button class="stopTimerButton">Stop Both Timer</button>
        <button class="resetButton">RESET</button>
      </div>
    `);
    const CLICK_EVENT = 'click';
    const startBtn = doc.getElementsByClassName('startTimerButton')[0];
    const stopBtn = doc.getElementsByClassName('stopTimerButton')[0];
    const lapBtn = doc.getElementsByClassName('lapTimerButton')[0];
    const resetBtn = doc.getElementsByClassName('resetButton')[0];
    const timerShellElement = doc.querySelector('.jsClientTimer');
    const timerTick = (timerState) => {
      const totalTimeTextElement = timerShellElement.querySelector('.totalTimeText');
      const timerTextElements = timerShellElement.querySelectorAll('.timerText');
      const laps = timerState.lapsString;
      let displayStr = '00:00:00';
      if (laps.length) {
        if (maxLaps === 1) {
          displayStr = laps[0];
        } else {
          displayStr = laps.map(time => time);
        }
      }
      timerTextElements.forEach((element) => {
        Object.assign(element, { innerHTML: displayStr });
      });
      totalTimeTextElement.innerHTML = timerState.totalTimeString || displayStr;
    };
    const timer = win.Kingular.clientTimerFactory(JSON, win.localStorage, redux, timerTick);

    stopBtn.addEventListener(CLICK_EVENT, () => {
      timer.stopTimer();
    });

    lapBtn.addEventListener(CLICK_EVENT, () => {
      if (timer.getTimerInfo().laps.length < (maxLaps + 1)) timer.lapTimer();
    });

    startBtn.addEventListener(CLICK_EVENT, () => {
      timer.startTimer();
    });

    resetBtn.addEventListener(CLICK_EVENT, () => {
      timer.resetTimer();
    });

    Object.assign(win.Kingular, { clientTimer: timer });
  };

  Object.assign(win.Kingular, { clientTimerUIFactory: uiInternals });
})(window);
