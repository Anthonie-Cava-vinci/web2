const maxTime = 5; //x
const expectedClicks = 10; //x
let startTime;
let currentClicks = 0; //x
let timerReference;
let timeOutID;

const button = document.querySelector('button');
const message = document.querySelector('#message');

button.addEventListener('mouseenter', startCounter);
button.addEventListener('click', clickHandler);

function startCounter() {
  startTime = new Date();
  timerReference = setTimeout(()=>alert(`Game over, you did not click ${expectedClicks} times within ${maxTime}s !`), maxTime * 1000);
}

function clickHandler() {
  ++currentClicks;
  if (currentClicks === expectedClicks) {
    clearTimeout(timerReference);
    const timeSpent = new Date().getTime() - startTime.getTime();
    button.style.display = 'none';
    alert(`You win ! you clicked ${expectedClicks} times within ${timeSpent}ms!`);
  }
}

