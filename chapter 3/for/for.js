// Define the questions array
const gameData = [
    {
      question: "Write a C program to print the multiplication table of 5 up to 10 times.",
      correctAnswer: `#include <stdio.h>
  int main() {
      for (int i = 1; i <= 10; i++) {
          printf("5 x %d = %d\\n", i, 5*i);
      }
      return 0;
  }`,
      answerPlaceholder: "Write the C code here..."
    }
  ];
  
  // Fisher-Yates Shuffle
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Normalize code function
  function normalizeCode(code) {
    return code
      .split('\n')
      .map(line => line.trim())
      .join('')
      .toLowerCase();
  }
  
  // Load question when page ready
  document.addEventListener('DOMContentLoaded', function() {
    const questionDiv = document.getElementById('question');
    const submitButton = document.getElementById('submit');
    const answerElement = document.getElementById('answer');
    
    if (!questionDiv || !submitButton || !answerElement) {
      console.error("Required elements not found!");
      return;
    }
  
    shuffleArray(gameData);
    const currentQuestion = gameData[0];
    questionDiv.innerText = currentQuestion.question;
    answerElement.placeholder = currentQuestion.answerPlaceholder;
  
    submitButton.addEventListener('click', function() {
      checkAnswer(currentQuestion);
    });
  });
  
  // Check Answer
  function checkAnswer(currentQuestion) {
    const userAnswerElement = document.getElementById('answer');
    if (!userAnswerElement) {
      console.error("Answer input not found!");
      return;
    }
  
    const userAnswer = userAnswerElement.value.trim();
    if (!userAnswer) {
      alert("Please write your answer before submitting!");
      return;
    }
  
    const normalizedUserAnswer = normalizeCode(userAnswer);
    const normalizedCorrectAnswer = normalizeCode(currentQuestion.correctAnswer);
  
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      // Correct
      redirectToRandomPage([
        "meme2/memespass1.html",
        "meme2/memespass2.html",
        "meme2/memespass3.html",
        "meme2/memespass4.html",
        "meme2/memespass5.html"
      ]);
    } else {
      // Wrong
      redirectToRandomPage([
        "meme2/memesfail1.html",
        "meme2/memesfail2.html",
        "meme2/memesfail3.html",
        "meme2/memesfail4.html",
        "meme2/memesfail5.html"
      ]);
    }
  }
  
  // Redirect to random page
  function redirectToRandomPage(pageCollection) {
    const randomIndex = Math.floor(Math.random() * pageCollection.length);
    window.location.href = pageCollection[randomIndex];
  }