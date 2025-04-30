// Define the questions array
const gameData = [
    {
        question: "What is the output of this code snippet in C?\n\n#include <stdio.h>\nint main() {\n    int a = 5, b = 3;\n    printf(\"%d\", a > b);\n    return 0;\n}",
        correctAnswer: "1",  // 1 because 5 > 3 is true
        answerPlaceholder: "Enter your answer here..."
    },
    {
        question: "What will be the output of this code?\n\n#include <stdio.h>\nint main() {\n    int x = 5;\n    printf(\"%d\", x == 5);\n    return 0;\n}",
        correctAnswer: "1",  // 1 because x == 5 is true
        answerPlaceholder: "Enter your answer here..."
    },
    {
        question: "What will be the output of this code?\n\n#include <stdio.h>\nint main() {\n    int a = 10, b = 20;\n    printf(\"%d\", a != b);\n    return 0;\n}",
        correctAnswer: "1",  // 1 because 10 != 20 is true
        answerPlaceholder: "Enter your answer here..."
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
let currentQuestion = gameData[currentQuestionIndex];

// Ensure the DOM is ready before trying to update the question
window.onload = function() {
    const questionDiv = document.getElementById('question');
    questionDiv.innerText = currentQuestion.question; // use innerText instead of textContent
}


// Function to check the answer
function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();
    if (userAnswer === currentQuestion.correctAnswer) {
         // List of HTML pages
         const pageCollection = [
            "meme/memespass1.html",
            "meme/memespass2.html",
            "meme/memespass3.html",
            "meme/memespass4.html",
            "meme/memespass5.html"
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
            "meme/memesfail1.html",
            "meme/memesfail2.html",
            "meme/memesfail3.html",
            "meme/memesfail4.html",
            "meme/memesfail5.html"
        ];

        // Pick a random page
        const randomIndex = Math.floor(Math.random() * pageCollection.length);
        const randomPageURL = pageCollection[randomIndex];
        // Redirect to the random page
        window.location.href = randomPageURL;
    }
}
