let cardsArray = [];
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let level = 1;
let timer;
let seconds = 0;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

function createCards() {
    cardsArray = [];
    const numPairs = level; // One pair for each letter in the current level
    for (let i = 0; i < numPairs; i++) {
        cardsArray.push(String.fromCharCode(65 + i), String.fromCharCode(65 + i)); // A-Z
    }
    shuffle(cardsArray);
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    createCards();
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    score = 0;
    seconds = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = seconds;

    cardsArray.forEach((value) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-value', value);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });

    startTimer();
    document.getElementById('level').textContent = level;
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        document.getElementById('timer').textContent = seconds;
    }, 1000);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.textContent = this.getAttribute('data-value');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value');

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    score++;
    document.getElementById('score').textContent = score;

    if (score === level) {
        clearInterval(timer);
        saveScore();
        level++;
        setTimeout(() => {
            createBoard();
        }, 1000);
    }

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function saveScore() {
    const newScore = { level: level - 1, time: seconds };
    leaderboard.push(newScore);
    leaderboard.sort((a, b) => a.time - b.time); // Sort by time ascending
    leaderboard = leaderboard.slice(0, 10); // Keep top 10 scores
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    displayLeaderboard();
}

function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `Level: ${entry.level}, Time: ${entry.time} seconds`;
        leaderboardList.appendChild(li);
    });
}

document.getElementById('resetButton').addEventListener('click', () => {
    cards = [];
    level = 1;
    createBoard();
});

document.addEventListener('DOMContentLoaded', () => {
    const helpSection = document.getElementById('help');
    const helpButton = document.createElement('button');
    helpButton.textContent = 'Help';
    helpButton.style.marginTop = '20px';
    helpButton.style.padding = '10px 15px';
    helpButton.style.border = 'none';
    helpButton.style.borderRadius = '5px';
    helpButton.style.backgroundColor = '#3f51b5';
    helpButton.style.color = 'white';
    helpButton.style.cursor = 'pointer';

    helpButton.addEventListener('click', () => {
        helpSection.style.display = helpSection.style.display === 'none' ? 'block' : 'none';
    });

    document.querySelector('.container').appendChild(helpButton);
});


// Initialize the game
createBoard();
