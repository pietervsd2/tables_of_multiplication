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
    "res/image05.jpg",
    "res/image05.jpg",
    "res/image06.jpg",
    "res/image07.jpg",
    "res/image08.jpg",
    "res/image09.jpg",
    "res/image10.jpg",
    "res/image11.jpg",
    "res/image12.jpg",
    "res/image13.jpg",
    "res/image14.jpg",
    "res/image15.jpg"
];
const numpadButtons = document.querySelectorAll(".numpad-button");
const clearButton = document.getElementById("clear");
const multiplicationButton = document.getElementById("multiplication");
const divisionButton = document.getElementById("division");
const bothButton = document.getElementById("both");
const easyButton = document.getElementById("easy");
const difficultButton = document.getElementById("difficult");
const options = document.querySelector(".options");
const gameElements = document.querySelector(".game-elements");

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
let operation = "multiplication";
let difficulty = "easy";
let chosenOperation = false;
let chosenDifficulty = false;



function getRandomBackgroundImage() {
    const index = Math.floor(Math.random() * backgroundImages.length);
    return backgroundImages[index];
}


function updateBackground() {
    const percentage = (score / 20) * 100;
    const gameContainer = document.querySelector(".game-container");
    gameContainer.style.setProperty("--reveal-width", `${percentage}%`);
}


function generateOperationEquation(operationType, num1, num2) {
    if (operationType === "multiplication") {
        equationDisplay.innerText = `${num1} × ${num2}`;
        correctAnswer = num1 * num2;
    } else if (operationType === "division") {
        const product = num1 * num2;
        equationDisplay.innerText = `${product} ÷ ${num2}`;
        correctAnswer = num1;
    }
    return correctAnswer;
}

function generateEquation() {
    let num1;
    let num2;
    let difficultyFactor;

    if (difficulty === "difficult") {
        difficultyFactor = 0.5;
    } else {
        difficultyFactor = 1;
    }

    do {
        num1 = Math.floor(Math.random() * 9) + 1; // Generate a random number between 1 and 9 (inclusive)
        num2 = Math.floor(Math.random() * 9) + 1; // Generate a random number between 1 and 9 (inclusive)
    } while (Math.random() > difficultyFactor && (num1 < 6 || num2 < 6));

    if (operation === "both") {
        const randomOperation = Math.random() > 0.5 ? "multiplication" : "division";
        return generateOperationEquation(randomOperation, num1, num2);
    } else {
        return generateOperationEquation(operation, num1, num2);
    }
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

function selectButton(button, otherButtons) {
    button.classList.add("selected");
    otherButtons.forEach((otherButton) => {
        otherButton.classList.remove("selected");
    });
}

// Update the event listeners for the operation buttons
multiplicationButton.addEventListener("click", () => {
    operation = "multiplication";
    chosenOperation = true;
    selectButton(multiplicationButton, [divisionButton, bothButton]);
    if (chosenOperation && chosenDifficulty) startGame();
});

divisionButton.addEventListener("click", () => {
    operation = "division";
    chosenOperation = true;
    selectButton(divisionButton, [multiplicationButton, bothButton]);
    if (chosenOperation && chosenDifficulty) startGame();
});

bothButton.addEventListener("click", () => {
    operation = "both";
    chosenOperation = true;
    selectButton(bothButton, [multiplicationButton, divisionButton]);
    if (chosenOperation && chosenDifficulty) startGame();
});

// Update the event listeners for the difficulty buttons
easyButton.addEventListener("click", () => {
    difficulty = "easy";
    chosenDifficulty = true;
    selectButton(easyButton, [difficultButton]);
    if (chosenOperation && chosenDifficulty) startGame();
});

difficultButton.addEventListener("click", () => {
    difficulty = "difficult";
    chosenDifficulty = true;
    selectButton(difficultButton, [easyButton]);
    if (chosenOperation && chosenDifficulty) startGame();
});



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

    const currentTime = new Date();
    const timeElapsed = Math.floor((currentTime - firstAnswerTime) / 1000);
    const finalScore = 500 - timeElapsed;

    if (highScore === null || finalScore > highScore) {
        highScore = finalScore;
        highScoreDisplay.innerText = highScore;
    }

    // Hide the game elements
    equationDisplay.style.display = "none";
    answerInput.style.display = "none";
    numpad.style.display = "none";
    submitButton.style.display = "none";
    timerDisplay.style.display = "none";
    feedbackDisplay.style.display = "none";
    options.style.display = "none";

    // Show the final score text
    const finalScoreText = document.createElement("p");
    finalScoreText.innerText = `Congratulations! Your final score is ${finalScore}.`;
    finalScoreText.style.position = "absolute";
    finalScoreText.style.top = "50%";
    finalScoreText.style.left = "50%";
    finalScoreText.style.transform = "translate(-50%, -50%)";
    finalScoreText.style.fontSize = "24px";
    finalScoreText.style.fontWeight = "bold";
    finalScoreText.style.textAlign = "center";
    gameContainer.appendChild(finalScoreText);

    // Refresh the page after 5 seconds
    setTimeout(() => {
        location.reload();
    }, 5000);
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
//startGame();