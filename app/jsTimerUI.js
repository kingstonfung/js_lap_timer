/* global Kingular:true, Redux:true */
((json, doc, ls, redux, anchorElement) => {
  const renderUIShell = () => (`
    <div class="jsClientTimer">
      Client Interaction: <div class="timerText">00:00:00</div>
      <br/>
      <button class="startTimerButton">Start Both Timer</button>
      <!--<button class="stopTimerButton">Stop Timer</button>-->
      <button class="lapTimerButton"><!--Lap-->Stop Client Timer</button>
      <!--<button class="resetButton">RESET EVERYTHING</button>-->
      <br/><br/>
      After Interaction: <div class="totalTimeText">00:00:00</div>
      <br/>
      <button class="stopTimerButton">Stop Both Timer</button>
      <button class="resetButton">RESET</button>
    </div>
  `);

  anchorElement.insertAdjacentHTML('afterbegin', renderUIShell());
  let timer;
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
      // displayStr = laps.map(time => time);
      displayStr = laps[0];
    }
    timerTextElements.forEach((element) => {
      Object.assign(element, { innerHTML: displayStr });
      // element.innerHTML = displayStr;
    });
    totalTimeTextElement.innerHTML = timerState.totalTimeString || displayStr;
  };

  stopBtn.addEventListener(CLICK_EVENT, () => {
    timer.stopTimer();
  });

  lapBtn.addEventListener(CLICK_EVENT, () => {
    if (timer.getTimerInfo().laps.length < 2) timer.lapTimer();
  });

  startBtn.addEventListener(CLICK_EVENT, () => {
    timer.startTimer();
  });

  resetBtn.addEventListener(CLICK_EVENT, () => {
    timer.resetTimer();
  });

  Kingular.clientTimer = Kingular.clientTimerFactory(json, ls, redux, timerTick);
  timer = Kingular.clientTimer;
})(JSON, document, window.localStorage, Redux, document.body);
