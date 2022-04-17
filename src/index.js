/**
 * DOM SELECTORS
 */

const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status");
const heading = document.querySelector(".js-heading");
const padContainer = document.querySelector(".js-pad-container");

/**
 * VARIABLES
 */
let computerSequence = []; // track the computer-generated sequence of pad presses
let playerSequence = []; // track the player-generated sequence of pad presses
let maxRoundCount = 0; // the max number of rounds, varies with the chosen level
let roundCount = 0; // track the number of rounds that have been played so far

/**
 *
 * The `pads` array contains an array of pad objects.
 *
 * Each pad object contains the data related to a pad: `color`, `sound`, and `selector`.
 * - The `color` property is set to the color of the pad (e.g., "red", "blue").
 * - The `selector` property is set to the DOM selector for the pad.
 * - The `sound` property is set to an audio file using the Audio() constructor.
 *
 * Audio file for the green pad: https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-2.mp3?raw=true
 * Audio file for the blue pad: https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-3.mp3?raw=true
 * Audio file for the yellow pad: https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-4.mp3?raw=true
 *
 */

const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio(
      "https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-1.mp3?raw=true"
    ),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio(
      "https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-2.mp3?raw=true"
    ),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio(
      "https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-3.mp3?raw=true"
    ),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio(
      "https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-4.mp3?raw=true"
    ),
  },
];

/**
 * EVENT LISTENERS
 */

padContainer.addEventListener("click", padHandler);
startButton.addEventListener("click", startButtonHandler);

/**
 * EVENT HANDLERS
 */

/**
 * Called when the start button is clicked.
 *
 * 1. `setLevel();` sets the `maxRoundCount` to 8 (default)
 *
 * 2. `roundCount += 1;` increments the roundCount by 1
 *
 * 3. `startButton.classList.add("hidden");` hides the start button
 *
 * 4. `status.classList.remove("hidden");` unhides while the status element,
 * which displays the status messages
 *
 * 5. `playComputerTurn()` starts the game with the computer going first
 *
 */
function startButtonHandler() {
  setLevel();
  roundCount += 1;

  startButton.classList.add("hidden");
  statusSpan.classList.remove("hidden");
  playComputerTurn();

  return { startButton, statusSpan };
}

/**
 * Called when one of the pads is clicked.
 *
 * 1. `const { color } = event.target.dataset;` extracts the value of `data-color`
 * attribute on the element that was clicked and stores it in the `color` variable
 *
 * 2. `if (!color) return;` exits the function if the `color` variable is falsy
 *
 * 3. Use the `.find()` method to retrieve the pad from the `pads` array and store
 * it in a variable called `pad`
 *
 * 4. `pad.sound.play();` plays the sound for the pad
 *
 * 5. Finally, call `checkPress(color)` to verify the player's selection
 *
 * 6. Return the `color` variable as the output
 */
function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;

  const pad = pads.find((pad) => pad.color === color);
  pad.sound.play();

  checkPress(color);

  return color;
}

/**
 * HELPER FUNCTIONS
 */

/**
 * Sets the level of the game given a `level` parameter.
 * Returns the length of the sequence for a valid `level` parameter (1 - 4) or
 * an error message otherwise.
 *
 * Each skill level will require the player to complete a different number of rounds, as follows:
 * Skill level 1: 8 rounds
 * Skill level 2: 14 rounds
 * Skill level 3: 20 rounds
 * Skill level 4: 31 rounds
 *
 *
 * Example:
 * setLevel() //> returns 8
 * setLevel(1) //> returns 8
 * setLevel(2) //> returns 14
 * setLevel(3) //> returns 20
 * setLevel(4) //> returns 31
 * setLevel(5) //> returns "Please enter level 1, 2, 3, or 4";
 * setLevel(8) //> returns "Please enter level 1, 2, 3, or 4";
 *
 */
function setLevel(level = 1) {
  const levelToRound = {
    1: 8,
    2: 14,
    3: 20,
    4: 31,
  };
  if (!levelToRound[level]) return "Please enter level 1, 2, 3, or 4";

  maxRoundCount = levelToRound[level];
  return maxRoundCount;
}

/**
 * Returns a randomly selected item from a given array.
 *
 * 1. `Math.random()` returns a floating-point, pseudo-random number in the range 0 to less than 1
 *
 * 2. Multiplying the value from `Math.random()` with the length of the array ensures that the range
 * of the random number is less than the length of the array. So if the length of the array is 4,
 * the random number returned will be between 0 and 4 (exclusive)
 *
 * 3. Math.floor() rounds the numbers down to the largest integer less than or equal the given value.
 *
 * Example:
 * getRandomItem([1, 2, 3, 4]) //> returns 2
 * getRandomItem([1, 2, 3, 4]) //> returns 1
 */
function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

/**
 * Sets the text content of a given HTML element with a given a message
 */
function setText(element, text) {
  element.textContent = text;
  return element;
}

/**
 * Activates a pad of a given color by playing its sound and light
 *
 * 1. Use the `.find()` method to retrieve the pad from the `pads` array and
 * store it in a variable called `pad`
 *
 * 2. `pad.selector.classList.add("activated");` adds the `"activated"` class
 * to the selected pad
 *
 * 3. `pad.sound.play();` plays the sound associated with the pad
 *
 * 4. After 500ms, the `setTimeout()` removes the `"activated"` class from the pad
 */

function activatePad(color) {
  const pad = pads.find((pad) => pad.color === color);
  pad.selector.classList.add("activated");
  pad.sound.play();

  setTimeout(() => {
    pad.selector.classList.remove("activated");
  }, 500);
}

/**
 * Activates a sequence of colors passed as an array to the function
 *
 * 1. The function takes a `sequence` array and iterates over it using `.forEach()`
 *
 * 2. For each element in `sequence`, use `setTimeout()` to call `activatePad()`, adding
 * a delay between each pad press. Without it, the pads in the sequence will be activated
 * all at once
 *
 * 3. The delay between each pad press, passed as a second argument to `setTimeout()`,
 * needs to change on each iteration. The first button in the sequence is activated after
 * 600ms, the next one after 1200ms (600ms after the first), the third one after 1800ms,
 * and so on
 */

function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, (index + 1) * 600);
  });
}

/**
 * Allows the computer to play its turn.
 *
 * 1. `padContainer.classList.add("unclickable");` prevents the user from pressing any of the pads
 *
 * 2. `setText(statusSpan, "The computer's turn...");` sets the status message letting the player
 * know it's the computer's turn
 *
 * 3. `setText(heading, `Round ${roundCount} of ${maxRoundCount}`);` sets the heading letting the
 * player know how many rounds are left
 *
 * 4. `getRandomItem(pads)` returns a random pad from the `pads` array, and `getRandomItem(pads).color`
 * returns the color associated with the pad. The color is added to the end of the `computerSequence`
 * array alongside any values from the previous round
 *
 * 5. `activatePads(computerSequence)` lights up each pad according to the order defined in
 * `computerSequence`
 *
 * 6. The playHumanTurn() function needs to be called after the computer’s turn is over, so
 * we need to add a delay and calculate when the computer will be done with the sequence of
 * pad presses. The `setTimeout()` function executes `playHumanTurn(roundCount)` one second
 * after the last pad in the sequence is activated. The total duration of the sequence corresponds
 * to the current round (roundCount) multiplied by 600ms which is the duration for each pad in the
 * sequence.
 */
function playComputerTurn() {
  padContainer.classList.add("unclickable");
  setText(statusSpan, "The computer's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);

  computerSequence.push(getRandomItem(pads).color);
  activatePads(computerSequence);

  setTimeout(() => playHumanTurn(roundCount), roundCount * 600 + 1000); // 5
}

/**
 * Allows the player to play their turn.
 *
 * 1. `padContainer.classList.remove("unclickable");` allows the pad to be pressable again
 *
 * 2. Display a status message showing the player how many presses are left in the round
 */
function playHumanTurn() {
  padContainer.classList.remove("unclickable");
  setText(
    statusSpan,
    `Player's turn: ${roundCount} Press${roundCount > 1 ? "es" : ""} Left`
  );
}

/**
 * Checks the player's selection every time the player presses on a pad during
 * the player's turn
 *
 * 1. Add the `color` variable to the end of the `playerSequence` array
 *
 * 2. Store the index of the `color` variable in a variable called `index`
 *
 * 3. Calculate how many presses are left in the round using
 * `computerSequence.length - playerSequence.length` and store the result in
 * a variable called `remainingPresses`
 *
 * 4. Set the status to let the player know how many presses are left in the round
 *
 * 5. Check whether the elements at the `index` position in `computerSequence`
 * and `playerSequence` match. If they don't match, it means the player made
 * a wrong turn, so call `resetGame()` with a failure message and exit the function
 *
 * 6. If there are no presses left (i.e., `remainingPresses === 0`), it means the round
 * is over, so call `checkRound()` instead to check the results of the round
 *
 */
function checkPress(color) {
  const index = playerSequence.push(color) - 1;
  const remainingPresses = computerSequence.length - playerSequence.length;

  setText(
    statusSpan,
    `Player's turn: ${remainingPresses} Press${
      remainingPresses > 1 ? "es" : ""
    } Left`
  );

  if (playerSequence[index] !== computerSequence[index]) {
    resetGame("Game over, you chose the wrong color!");
  } else if (remainingPresses === 0) {
    checkRound();
  }
}

/**
 * Checks each round to see if the player has completed all the rounds of the game * or advance to the next round if the game has not finished.
 *
 * 1. If the length of the `playerSequence` array matches `maxRoundCount`, it means that
 * the player has completed all the rounds so call `resetGame()` with a success message
 *
 * 2. Else, the `roundCount` variable is incremented by 1 and the `playerSequence` array
 * is reset to an empty array.
 * - And the status text is updated to let the player know to keep playing (e.g., "Nice! Keep going!")
 * - And `playComputerTurn()` is called after 1000 ms (using setTimeout()). The delay
 * is to allow the user to see the success message. Otherwise, it will not appear at
 * all because it will get overwritten.
 *
 */

function checkRound() {
  if (playerSequence.length === maxRoundCount) {
    resetGame("Congratulations! You completed all the levels.");
  } else {
    roundCount += 1;
    playerSequence = [];
    setText(statusSpan, "Nice! Keep going!");
    setTimeout(playComputerTurn, 1000);
  }
}

/**
 * Resets the game. Called when either the player makes a mistake or wins the game.
 *
 * 1. Reset `computerSequence` to an empty array
 *
 * 2. Reset `playerSequence` to an empty array
 *
 * 3. Reset `roundCount` to an empty array
 */
function resetGame(text) {
  computerSequence = [];
  playerSequence = [];
  roundCount = 0;

  alert(text);
  setText(heading, "Simon Says");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");
}

/**
 * Please do not modify the code below.
 * Used for testing purposes.
 *
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;
