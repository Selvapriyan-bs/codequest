// Define the questions array
const gameData = [
    {
        question: "Write a C program to count the sum of the first 10 numbers using a while loop.",
        correctAnswer: `#include <stdio.h>
int main() {
    int num = 1;     
    int sum = 0;     
    while (num <= 10) {
        sum += num;  
        num++;      
    }
    printf("The sum of the first 10 numbers is: %d", sum);
    return 0;
}`,
        answerPlaceholder: "Write the C code here..."
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

// Get the first question
let currentQuestionIndex = 0;
let currentQuestion = gameData[currentQuestionIndex];

// Ensure the DOM is ready before updating the question
window.onload = function() {
    const questionDiv = document.getElementById('question');
    questionDiv.innerText = currentQuestion.question;
}

// Function to remove spaces and line breaks
function normalizeCode(code) {
    return code
        .replace(/\s+/g, '') // Remove all whitespace (spaces, tabs, newlines)
        .toLowerCase();      // Optional: ignore case differences too
}

// Function to check the answer
function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();

    const normalizedUserAnswer = normalizeCode(userAnswer);
    const normalizedCorrectAnswer = normalizeCode(currentQuestion.correctAnswer);

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
        // Correct answer
        const pageCollection = [
            "meme/memespass1.html",
            "meme/memespass2.html",
            "meme/memespass3.html",
            "meme/memespass4.html",
            "meme/memespass5.html"
        ];
        const randomIndex = Math.floor(Math.random() * pageCollection.length);
        window.location.href = pageCollection[randomIndex];
    } else {
        // Wrong answer
        const pageCollection = [
            "meme/memesfail1.html",
            "meme/memesfail2.html",
            "meme/memesfail3.html",
            "meme/memesfail4.html",
            "meme/memesfail5.html"
        ];
        const randomIndex = Math.floor(Math.random() * pageCollection.length);
        window.location.href = pageCollection[randomIndex];
    }
}
