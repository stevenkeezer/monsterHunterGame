/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let startTime = Date.now();
let SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  heroImage = new Image();
  heroImage.onload = function() {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function() {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}

/**
 * Setting up our characters.
 *
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 *
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

let score = 0;

const applicationState = {
  score: 0,
  highScore: 0,
  date: new Date(),
  isGameOver: false,
  currentUser: "Anonymous",
  // gameHistory: [
  //   { score: 11, date: new Date(), username: "Steven" },
  //   { score: 13, username: "John", date: new Date() },
  //   { score: 11, username: "Bob", date: new Date() },
  //   { score: 8, username: "Sally", date: new Date() }
  // ]
};

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  addEventListener(
    "keydown",
    function(key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */

function updateState(key, value) {
  const appState = JSON.parse(localStorage.getItem("applicationState"));
  appState[key] = value;
  localStorage.setItem("applicationState", JSON.stringify(appState));
}

function getData(key) {
  const appState = JSON.parse(localStorage.getItem("applicationState"));
  return appState[key];
}
// console.log(getData('date'))

function changeUsername() {
  let usernameInput = document.getElementById("usernameInput");
  let usernameButton = document.getElementById("usernameButton");
  username.innerHTML = usernameInput.value;
  // applicationState.currentUser = usernameInput.value;
  // localStorage.setItem("applicationState", JSON.stringify(applicationState));
  updateState("currentUser", usernameInput.value);
}

// console.log(updateState("currentUser", "John fucker"))

let update = function() {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (38 in keysDown) {
    // Player is holding up key
    heroY -= 5;
  }
  if (40 in keysDown) {
    // Player is holding down key
    heroY += 5;
  }
  if (37 in keysDown) {
    // Player is holding left key
    heroX -= 5;
  }
  if (39 in keysDown) {
    // Player is holding right key
    heroX += 5;
  }

  if (heroX <= 0) {
    heroX = canvas.width - 10;
  }

  if (heroX >= canvas.width) {
    heroX = 0;
  }

  if (heroY <= 0) {
    heroY = canvas.height - 10;
  }

  if (heroY >= canvas.height) {
    heroY = 0;
  }

  // console.log(applicationState.topScores)
  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  const heroHasCaughtMonster =
    heroX <= monsterX + 32 &&
    monsterX <= heroX + 32 &&
    heroY <= monsterY + 32 &&
    monsterY <= heroY + 32;
  if (heroHasCaughtMonster) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.

    applicationState.score += 1;

    updateState("score", applicationState.score);




    document.getElementById("score").innerHTML = applicationState.score;


    
    
    // highScore = getData('score')


    monsterX = Math.floor(Math.random() * (476 - 10 + 1)) + 10;
    monsterY = Math.floor(Math.random() * (435 - 10 + 1)) + 10;
  }
};




window.onload = function() {
  localStorage.setItem("applicationState", JSON.stringify(applicationState));

  document.getElementById("highScore").innerHTML = getData("highScore");


  // on refresh current score need to become high score.
  if (getData("score") > getData("highScore")) {    
    updateState("highScore", JSON.stringify(getData('score')));
    document.getElementById("highScore").innerHTML = getData('highScore')


};
}
/**
 * This function, render, runs as often as possible.
 */
var render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }

  ctx.fillText(
    `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`,
    20,
    100
  );
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function() {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();
