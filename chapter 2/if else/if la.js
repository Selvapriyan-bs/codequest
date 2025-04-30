// Define the questions array
const gameData = [
    {
        question: "Write the C code to print if killed is greater than 50,print 'You are selected as leader of soldiers`,else if killed is more than 30 but less than 50 print'You are selected as commander' otherwise print 'You are a soldier'. take killed=56",
        correctAnswer: `#include <stdio.h>
int main() {
int killed = 56;
if (killed > 56) {
    printf("You are selected as leader of soldiers");
} else if(killed >30 && killed<50) {
    printf("You are selected as commender");
}else{
printf("You are a soldier");
}
return 0;
}`,  // Correct C code that matches the question
        answerPlaceholder: "Write the C code here..."
    }
]


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
            "meme4/memespass1.html",
            "meme4/memespass2.html",
            "meme4/memespass3.html",
            "meme4/memespass4.html",
            "meme4/memespass5.html"
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
            "meme4/memesfail1.html",
            "meme4/memesfail2.html",
            "meme4/memesfail3.html",
            "meme4/memesfail4.html",
            "meme4/memesfail5.html"
        ];

        // Pick a random page
        const randomIndex = Math.floor(Math.random() * pageCollection.length);
        const randomPageURL = pageCollection[randomIndex];
        // Redirect to the random page
        window.location.href = randomPageURL;
    }
}
