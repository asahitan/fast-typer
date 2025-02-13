const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score-value");
const tpsDisplay = document.getElementById("tps-value");
const timeDisplay = document.getElementById("time-left");
const startButton = document.getElementById("start-btn");
const resultMessage = document.getElementById("result-message");
const modeSelect = document.getElementById("mode-select");
const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.getElementById("side-menu");
const closeMenuButton = document.getElementById("close-menu");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const livesDisplay = document.getElementById("lives-value");
const livesContainer = document.getElementById("lives");
const customTimeInput = document.getElementById("custom-time");
const customTimeLabel = document.getElementById("custom-time-label");
const currentModeDisplay = document.getElementById("current-mode-display");

let words = ["javascript", "developer", "framework", "performance", "syntax", "debugging", "algorithm", "data"];
let currentWord = "";
let score = 0;
let timeLeft = 60;
let totalWordsTyped = 0;
let isPlaying = false;
let isPaused = false;
let tps = 0;
let gameMode = "60s";
let gameInterval;
let lives = 3;
let customTime = 60;

const modeDescriptions = {
    "60s": "60-Second Mode",
    "10s": "10-Second Challenge Mode",
    "5s-lives": "5-Second Challenge Mode with Lives",
    "3s-lives": "3-Second Challenge Mode with Lives",
    "7s-lives": "7-Second Challenge Mode with Lives",
    "2s-lives": "2-Second Challenge Mode with Lives",
    "custom": "Custom Mode"
};

// Update Mode Display and Sync Timer
function updateModeDisplayAndTimer() {
    currentModeDisplay.textContent = `Mode: ${modeDescriptions[gameMode]}`;
    
    switch (gameMode) {
        case "60s":
            timeLeft = 60;
            livesContainer.style.display = "none";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            break;
        case "10s":
            timeLeft = 10;
            livesContainer.style.display = "none";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            break;
        case "custom":
            customTimeInput.style.display = "block";
            customTimeLabel.style.display = "block";
            customTime = parseInt(customTimeInput.value) || 60;
            timeLeft = customTime;
            livesContainer.style.display = "none";
            break;
        default:
            timeLeft = parseInt(gameMode.split('-')[0]); // Fix for modes like "10s"
            livesContainer.style.display = "block";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            livesDisplay.textContent = 3;
            break;
    }
    timeDisplay.textContent = timeLeft;
}

// Start Game
function startGame() {
    if (isPaused) {
        isPlaying = true;
        isPaused = false;
        startButton.textContent = "Playing...";
        startButton.disabled = true;

        gameInterval = setInterval(() => {
            if (timeLeft > 0 && isPlaying) {
                timeLeft--;
                timeDisplay.textContent = timeLeft;
                updateTPS();
                if (gameMode.includes("lives") && timeLeft === 0) {
                    handleLifeLoss();
                }
            } else if (timeLeft === 0) {
                clearInterval(gameInterval);
                endGame();
            }
        }, 1000);
        return;
    }

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
    
    if (gameMode === "custom") {
        customTime = parseInt(customTimeInput.value) || 60;
        timeLeft = customTime;
    }
    
    updateModeDisplayAndTimer();
    
    nextWord();

    gameInterval = setInterval(() => {
        if (timeLeft > 0 && isPlaying) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            updateTPS();

            if (gameMode.includes("lives") && timeLeft === 0) {
                handleLifeLoss();
            }
        } else if (timeLeft === 0) {
            clearInterval(gameInterval);
            endGame();
        }
    }, 1000);
}

// Handle Life Loss
function handleLifeLoss() {
    lives--;
    livesDisplay.textContent = lives;

    if (lives === 0) {
        clearInterval(gameInterval);
        endGame();
    } else {
        timeLeft = parseInt(gameMode.split('-')[0]);
        nextWord();
    }
}

// End Game
function endGame() {
    isPlaying = false;
    isPaused = false;
    wordInput.disabled = true;
    startButton.disabled = false;
    startButton.textContent = "Start Game";
    resultMessage.textContent = `Game Over! Final Score: ${score} | TPS: ${tps.toFixed(2)}`;
}

// Get New Word
function nextWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
}

// Update TPS
function updateTPS() {
    tps = totalWordsTyped / (customTime || 60 - timeLeft);
    tpsDisplay.textContent = tps.toFixed(2);
}

// Check Input
wordInput.addEventListener("input", () => {
    if (wordInput.value.trim() === currentWord) {
        score++;
        totalWordsTyped++;
        scoreDisplay.textContent = score;
        wordInput.value = "";

        if (gameMode.includes("lives")) {
            timeLeft = parseInt(gameMode.split('-')[0]);
        }

        nextWord();
        updateTPS();
    }
});

// Button & Mode Event Listeners
startButton.addEventListener("click", startGame);
modeSelect.addEventListener("change", () => {
    gameMode = modeSelect.value;
    updateModeDisplayAndTimer();
});

// Menu & Dark Mode
menuToggle.addEventListener("click", () => {
    sideMenu.style.width = "250px";
});
closeMenuButton.addEventListener("click", () => {
    sideMenu.style.width = "0";
});
darkModeToggle.addEventListener("change", (e) => {
    document.body.classList.toggle("dark-mode", e.target.checked);
});

// Prevent Copy-Paste (Cheating Prevention)
wordInput.addEventListener('paste', (e) => e.preventDefault());
wordInput.addEventListener('copy', (e) => e.preventDefault());
wordInput.addEventListener('contextmenu', (e) => e.preventDefault());
