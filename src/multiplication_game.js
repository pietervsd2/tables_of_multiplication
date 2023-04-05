const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const equationDisplay = document.getElementById("equation");
const answerInput = document.getElementById("answer");
const submitButton = document.getElementById("submit");
const feedbackDisplay = document.getElementById("feedback");
const highScoreDisplay = document.getElementById("high-score");
const backgroundImages = [
    "res/image01.jpg",
    "res/image02.jpg",
    "res/image03.jpg",
    "res/image04.jpg",
    "res/image05.jpg"
];
const numpadButtons = document.querySelectorAll(".numpad-button");
const clearButton = document.getElementById("clear");

numpadButtons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        answerInput.value += value;
    });
});

clearButton.addEventListener("click", () => {
    answerInput.value = "";
});


let highScore = null;
let firstAnswerTime = null;

let score = 0;
let startTime = null;
let correctAnswer = 0;



function getRandomBackgroundImage() {
    const index = Math.floor(Math.random() * backgroundImages.length);
    return backgroundImages[index];
}


function updateBackground() {
    const percentage = (score / 20) * 100;
    const gameContainer = document.querySelector(".game-container");
    gameContainer.style.setProperty("--reveal-width", `${percentage}%`);
}


function generateEquation() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    correctAnswer = num1 * num2;
    equationDisplay.innerText = `${num1} × ${num2} = `;
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === correctAnswer) {
        // Set the firstAnswerTime when the first correct answer is submitted
        if (score === 0) {
            firstAnswerTime = new Date();
        }

        score++;
        scoreDisplay.innerText = score;
        feedbackDisplay.innerText = "Correct!";
        answerInput.value = "";
        updateBackground();
        if (score === 20) {
            endGame();
        } else {
            generateEquation();
        }
    } else {
        feedbackDisplay.innerText = "Fout. Probeer opnieuw!";
    }
}


function startGame() {
    score = 0;
    startTime = new Date();
    firstAnswerTime = null;
    submitButton.disabled = false;
    answerInput.disabled = false;
    generateEquation();
    updateTimer();

    const randomBackgroundImage = getRandomBackgroundImage();
    const gameContainer = document.querySelector(".game-container");
    gameContainer.style.setProperty("--background-image", `url("${randomBackgroundImage}")`);
}


function endGame() {
    startTime = null; // Stop the timer
    submitButton.disabled = true;
    answerInput.disabled = true;
    feedbackDisplay.innerText = "GOED GEDAAN! Je hebt 20 vragen correct beantwoord.";

    const currentTime = new Date();
    const timeElapsed = Math.floor((currentTime - firstAnswerTime) / 1000);
    const finalScore = 500 - timeElapsed;

    if (highScore === null || finalScore > highScore) {
        highScore = finalScore;
        highScoreDisplay.innerText = highScore;
    }
    setTimeout(function() {
      // Create a new container element for the background image
      //const backgroundImageContainer = document.createElement('div');
      //backgroundImageContainer.style.height = '100vh';
      //backgroundImageContainer.style.width = '100vw';
      
      //backgroundImageContainer.style.setProperty("--background-image", `url("${randomBackgroundImage}")`);
      //backgroundImageContainer.style.backgroundSize = 'cover';
      //backgroundImageContainer.style.backgroundPosition = 'center';

      // Remove all elements from the screen
      document.getElementById('game-wrapper').innerHTML = '';
      

      // Add the background image container back to the body
      //document.body.appendChild(backgroundImageContainer);
    }, 4000);
    document.body.style.backgroundImage = `url('${randomBackgroundImage}')`;

}

function updateTimer() {
    if (startTime !== null) {
        const currentTime = new Date();
        const timeElapsed = Math.floor((currentTime - startTime) / 1000);
        timerDisplay.innerText = timeElapsed;
    }
    setTimeout(updateTimer, 1000);
}

// Event listeners
submitButton.addEventListener("click", checkAnswer);
answerInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        checkAnswer();
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        checkAnswer();
    }
});

// Start the game
startGame();