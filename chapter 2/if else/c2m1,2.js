// Define the questions array
const gameData = [
    {
        question: "What is the output of this C code?\n\n#include <stdio.h>\nint main() {\n    int time = 22;\n    if (time < 10) {\n        printf(\"Good Morning.\");\n    } else if (time < 20) {\n        printf(\"Good Day.\");\n    } else {\n        printf(\"Good Evening.\");\n    }\n    return 0;\n}",
        correctAnswer: "Good Evening.",
        answerPlaceholder: "Enter the output here..."
    },
    {
        question: "What will be the output?\n\nint marks = 85;\nif (marks > 90) {\n    printf(\"Excellent\");\n} else if (marks > 75) {\n    printf(\"Very Good\");\n} else {\n    printf(\"Good\");\n}",
        correctAnswer: "Very Good",
        answerPlaceholder: "Enter the output here..."
    },
    {
        question: "Predict the output:\n\nint temperature = 15;\nif (temperature > 30) {\n    printf(\"Hot Day\");\n} else if (temperature > 20) {\n    printf(\"Pleasant Day\");\n} else {\n    printf(\"Cold Day\");\n}",
        correctAnswer: "Cold Day",
        answerPlaceholder: "Enter the output here..."
    },
    {
        question: "Find the output of the following:\n\nint speed = 70;\nif (speed > 100) {\n    printf(\"Over Speeding\");\n} else if (speed > 60) {\n    printf(\"Normal Speed\");\n} else {\n    printf(\"Slow Speed\");\n}",
        correctAnswer: "Normal Speed",
        answerPlaceholder: "Enter the output here..."
    }
];

// Fisher-Yates Shuffle function to randomize the order of questions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Shuffle the questions when the page loads
shuffleArray(gameData);

// Get the first question from the shuffled array
let currentQuestionIndex = 0;
const currentQuestion = gameData[currentQuestionIndex];

// Ensure the DOM is ready before trying to update the question
window.onload = function() {
    const questionDiv = document.getElementById('question');
    questionDiv.textContent = currentQuestion.question; // Set the question text
}

// Function to check the answer
function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();
    if (userAnswer === currentQuestion.correctAnswer) {
      // List of HTML pages
      const pageCollection = [
        "meme3/memespass1.html",
        "meme3/memespass2.html",
        "meme3/memespass3.html",
        "meme3/memespass4.html",
        "meme3/memespass5.html"
    ];

    // Pick a random page
    const randomIndex = Math.floor(Math.random() * pageCollection.length);
    const randomPageURL = pageCollection[randomIndex];
    // Redirect to the random page
    window.location.href = randomPageURL;
        // Proceed to the next question or move to next page
        currentQuestionIndex++;
        if (currentQuestionIndex < gameData.length) {
            // Load next question
            const nextQuestion = gameData[currentQuestionIndex];
            document.getElementById('question').textContent = nextQuestion.question;
            currentQuestion = nextQuestion;
            document.getElementById('answer').value = ''; // Clear the answer field
        } else {
            alert('You have completed all the questions!');
        }
    } else {
        const pageCollection = [
            "meme3/memesfail1.html",
            "meme3/memesfail2.html",
            "meme3/memesfail3.html",
            "meme3/memesfail4.html",
            "meme3/memesfail5.html"
        ];

        // Pick a random page
        const randomIndex = Math.floor(Math.random() * pageCollection.length);
        const randomPageURL = pageCollection[randomIndex];
        // Redirect to the random page
        window.location.href = randomPageURL;
    }
}
