// Game state variables
let questions = [];
let currentQuestionIndex = 0;
let currentPin = 0;
let xp = 0;

// NEW: Variables to handle the lesson structure
let allLessons = [];
let currentLesson;

const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const mountainPath = document.querySelector('.mountain-path');
const xpDisplay = document.getElementById('xp-display');

// Constants for the game
const NUMBER_OF_PINS = 5;
const XP_PER_CORRECT_ANSWER = 50; 

/**
 * Fetches the lessons from the lessons.json file.
 * This is the first function that runs to start the game.
 */
async function loadLessons() {
    try {
        const response = await fetch('lessons.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        allLessons = data.lessons;
        
        // This line selects the first lesson from the data.
        currentLesson = allLessons[0];
        // This line gets the questions from the selected lesson.
        questions = currentLesson.questions;

        console.log("Lessons loaded:", allLessons);
        startGame();
    } catch (error) {
        console.error("Failed to load lessons:", error);
        questionText.textContent = "Error loading game data.";
    }
}

/**
 * Initializes the game, creates the pins, and displays the first question.
 */
function startGame() {
    // Create the visual pins on the mountain path
    for (let i = 0; i < NUMBER_OF_PINS; i++) {
        const pin = document.createElement('div');
        pin.classList.add('pin');
        pin.id = `pin-${i}`;
        mountainPath.appendChild(pin);
    }
    
    showQuestion();
    updatePin();
    updateXPDisplay();
}

/**
 * Displays the current question and its answer choices.
 */
function showQuestion() {
    // Clear previous buttons
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }

    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.question;

    currentQ.options.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('answer-button');
        // When a button is clicked, it calls the checkAnswer function.
        button.addEventListener('click', () => checkAnswer(index));
        answerButtons.appendChild(button);
    });
}

/**
 * Checks if the user's answer is correct and updates the game.
 * @param {number} selectedAnswerIndex - The index of the answer the user clicked.
 */
function checkAnswer(selectedAnswerIndex) {
    const currentQ = questions[currentQuestionIndex];
    // NOTE: The new data uses 'answer' instead of 'correctAnswerIndex'.
    if (selectedAnswerIndex + 1 === currentQ.answer) {
        const activePinElement = document.querySelector('.pin.active');
        if (activePinElement) {
            activePinElement.classList.add('jumping');
            setTimeout(() => {
                activePinElement.classList.remove('jumping');
            }, 500);
        }

        alert("Correct! You climb to the next pin.");
        currentPin++;
        xp += XP_PER_CORRECT_ANSWER;
        updatePin();
        updateXPDisplay();
        // Move to the next question in the lesson.
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        showQuestion();
    } else {
        alert("Incorrect. Try the next question!");
        showQuestion();
    }
}

/**
 * Updates the visual position of the player on the mountain.
 */
function updatePin() {
    const allPins = document.querySelectorAll('.pin');
    allPins.forEach((pin, index) => {
        pin.classList.remove('active');
        if (index === currentPin) {
            pin.classList.add('active');
        }
    });

    if (currentPin >= NUMBER_OF_PINS) {
        alert("Congratulations! You've reached the top of Pin Mountain!");
        // We can add game restart logic here
    }
}

/**
 * Updates the XP counter on the screen.
 */
function updateXPDisplay() {
    xpDisplay.textContent = xp;
}

// Start the game by loading the questions from the new file.
loadLessons();