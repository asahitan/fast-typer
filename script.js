const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score-value");
const tpsDisplay = document.getElementById("tps-value");
const timeDisplay = document.getElementById("time-left");
const startButton = document.getElementById("start-btn");
const resultMessage = document.getElementById("result-message");
const modeSelect = document.getElementById("mode-select");
const customTimeInput = document.getElementById("custom-time");
const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.getElementById("side-menu");
const closeMenuButton = document.getElementById("close-menu");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const livesDisplay = document.getElementById("lives-value");
const livesContainer = document.getElementById("lives");

let words = [
    "javascript", "advanced", "developer", "keyboard", "function", "variable",
    "typing", "speed", "test", "framework", "browser", "performance", "syntax", 
    "debugging", "algorithm", "data", "structure", "application", "interface"
];
let currentWord = "";
let score = 0;
let timeLeft = 60;
let totalWordsTyped = 0;
let isPlaying = false;
let tps = 0;
let gameMode = "60s";
let gameInterval;
let lives = 3;

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function startGame() {
    score = 0;
    totalWordsTyped = 0;
    tps = 0;
    isPlaying = true;
    wordInput.value = "";
    resultMessage.textContent = "";
    wordInput.disabled = false;
    wordInput.focus();
    startButton.disabled = true;
    startButton.textContent = "Playing...";
    lives = 3;
    livesDisplay.textContent = lives;

    gameMode = modeSelect.value;
    
    if (gameMode === "60s") {
        timeLeft = 60;
        livesContainer.classList.add("hidden");
    } else if (gameMode === "10s") {
        timeLeft = 10;
        livesContainer.classList.add("hidden");
    } else if (gameMode === "5s-lives") {
        timeLeft = 5;
        livesContainer.classList.remove("hidden");
    } else if (gameMode === "custom") {
        let customTime = parseInt(customTimeInput.value);
        if (customTime > 0) {
            timeLeft = customTime;
        } else {
            alert("Please enter a valid custom time.");
            startButton.disabled = false;
            startButton.textContent = "Start Game";
            return;
        }
        livesContainer.classList.add("hidden");
    }

    timeDisplay.textContent = timeLeft;
    nextWord();

    gameInterval = setInterval(() => {
        if (timeLeft > 0 && isPlaying) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            updateTPS();

            if (gameMode === "5s-lives" && timeLeft === 0) {
                handleLifeLoss();
            }

        } else if (timeLeft === 0) {
            clearInterval(gameInterval);
            endGame();
        }
    }, 1000);
}

function nextWord() {
    currentWord = getRandomWord();
    wordDisplay.textContent = currentWord;
}

function checkWord() {
    if (!isPlaying) return;
    
    if (wordInput.value.trim() === currentWord) {
        score++;
        totalWordsTyped++;
        scoreDisplay.textContent = score;
        wordInput.value = "";
        nextWord();

        if (gameMode === "5s-lives") {
            timeLeft = 5;
        }
    }
}

function updateTPS() {
    tps = totalWordsTyped / (60 - timeLeft);
    tpsDisplay.textContent = tps.toFixed(2);
}

function endGame() {
    isPlaying = false;
    startButton.disabled = false;
    startButton.textContent = "Start Game";
    wordInput.disabled = true;
    resultMessage.textContent = `Game Over! Your score is ${score}. TPS: ${tps.toFixed(2)}`;
}

function handleLifeLoss() {
    lives--;
    livesDisplay.textContent = lives;
    
    if (lives > 0) {
        timeLeft = 5;
    } else {
        clearInterval(gameInterval);
        endGame();
    }
}

startButton.addEventListener("click", startGame);
wordInput.addEventListener("input", checkWord);
menuToggle.addEventListener("click", () => sideMenu.style.width = "250px");
closeMenuButton.addEventListener("click", () => sideMenu.style.width = "0");
darkModeToggle.addEventListener("change", () => document.body.classList.toggle("dark-mode"));
