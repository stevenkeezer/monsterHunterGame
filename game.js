/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/ 
let elapsedTime = 0;
let timer;
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;


let SECONDS_PER_ROUND = 15;


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

function startGame() {
  document.getElementById("startButton").style.display = "none";
  monsterX = Math.floor(Math.random() * (476 - 10 + 1)) + 10;
  monsterY = Math.floor(Math.random() * (435 - 10 + 1)) + 10;
  timer = setInterval(() => {
    elapsedTime += 1;

    document.getElementById("timer").innerHTML =
      SECONDS_PER_ROUND - elapsedTime;
  }, 1000);
}

function stopGame() {
  clearInterval();
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

let heroX = canvas.width / 2 + 5;
let heroY = canvas.height / 2;

let monsterX = 220;
let monsterY = 239;

let score = 0;

const applicationState = {
  score: 0,
  highScore: 0,
  userCount: 0,
  date: new Date(),
  currentUser: "Anonymous",
  highScoreUser: "",
  gameHistory: [
    { score: 3, date: new Date(), username: "Steven" },
    { score: 5, date: new Date(), username: "Jeff Daniels" },
    { score: 2, date: new Date(), username: "BigBoy" },
    { score: 8, date: new Date(), username: "Tupac" },
    { score: 13, date: new Date(), username: "Jesus H." }
  ]
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

function changeUsername() {
  let usernameInput = document.getElementById("usernameInput");
  let usernameButton = document.getElementById("usernameButton");
  updateState("currentUser", usernameInput.value);
  document.getElementById("username").innerHTML = getData("currentUser");
  usernameInput.value = "";
}

function move() {
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
}

function wrapAround() {
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
}

function checkIfMonsterCaught() {
  const heroHasCaughtMonster =
    heroX <= monsterX + 32 &&
    monsterX <= heroX + 32 &&
    heroY <= monsterY + 32 &&
    monsterY <= heroY + 32;
  if (heroHasCaughtMonster) {
    applicationState.score += 1;
    updateState("score", applicationState.score);
    monsterX = Math.floor(Math.random() * (476 - 10 + 1)) + 10;
    monsterY = Math.floor(Math.random() * (435 - 10 + 1)) + 10;
  }
}

let update = function() {
  // Update the time.
  if (document.getElementById("timer").innerHTML === "0") {
    clearInterval(timer);
  }
  document.getElementById("score").innerHTML = applicationState.score;

  if (elapsedTime <= 0) {
    return;
  }

  move();
  wrapAround();
  checkIfMonsterCaught();
};

window.onload = function() {
  if (localStorage.length === 0) {
    localStorage.setItem("applicationState", JSON.stringify(applicationState));
  }


  updateState('userCount', getData("userCount") + 1);
  updateState("currentUser", "User" + getData("userCount"));
  document.getElementById('username').innerHTML = 'User' + getData('userCount');

  let gamehistory = getData("gameHistory");
  gamehistory.sort((a, b) => b.score - a.score);
  updateState("gameHistory", gamehistory);

  document.getElementById("highScore").innerHTML = gamehistory[0].score;
  document.getElementById("leaderboard").innerHTML = gamehistory[0].username;
  document.getElementById("highScore1").innerHTML = gamehistory[1].score;
  document.getElementById("leaderboard1").innerHTML = gamehistory[1].username;
  document.getElementById("highScore2").innerHTML = gamehistory[2].score;
  document.getElementById("leaderboard2").innerHTML = gamehistory[2].username;
  document.getElementById("highScore3").innerHTML = gamehistory[3].score;
  document.getElementById("leaderboard3").innerHTML = gamehistory[3].username;
  document.getElementById("highScore4").innerHTML = gamehistory[4].score;
  document.getElementById("leaderboard4").innerHTML = gamehistory[4].username;
};

/**
 * This function, render, runs as often as possible.
 */

function once(fn, context) {
  var result;
  return function() {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }
    return result;
  };
}

var canOnlyFireOnce = once(function() {
  updateGameHis();
});

const render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  const ifUserStillHasTime =
    Number(document.getElementById("timer").innerHTML) > 0;
  if (ifUserStillHasTime) {
  } else {
    heroX = canvas.width / 2 - 25;
    heroY = canvas.height / 2;
    monsterX = -60;
    monsterY = -60;
    document.getElementById("newGameButton").style.display = "flex";
    document.getElementById("gameOver").style.display = "flex";
    canOnlyFireOnce();
  }
};

function updateGameHis() {
  let gamehistory = getData("gameHistory");
  gamehistory.push({
    score: getData("score"),
    username: getData("currentUser")
  });
  gamehistory.sort((a, b) => b.score - a.score);
  updateState("gameHistory", gamehistory);
  document.getElementById("highScore").innerHTML = gamehistory[0].score;
  document.getElementById("leaderboard").innerHTML = gamehistory[0].username;
  document.getElementById("highScore1").innerHTML = gamehistory[1].score;
  document.getElementById("leaderboard1").innerHTML = gamehistory[1].username;
  document.getElementById("highScore2").innerHTML = gamehistory[2].score;
  document.getElementById("leaderboard2").innerHTML = gamehistory[2].username;
  document.getElementById("highScore3").innerHTML = gamehistory[3].score;
  document.getElementById("leaderboard3").innerHTML = gamehistory[3].username;
  document.getElementById("highScore4").innerHTML = gamehistory[4].score;
  document.getElementById("leaderboard4").innerHTML = gamehistory[4].username;
}

var keys = {};
window.addEventListener(
  "keydown",
  function(e) {
    keys[e.keyCode] = true;
    switch (e.keyCode) {
      case 37:
      case 39:
      case 38:
      case 40: // Arrow keys
        e.preventDefault();
        break; // Space
      default:
        break; // do not block other keys
    }
  },
  false
);
window.addEventListener(
  "keyup",
  function(e) {
    keys[e.keyCode] = false;
  },
  false
);
/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
const main = function() {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
const w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();
