if (localStorage.getItem('totalScore') === null) {
  localStorage.setItem('totalScore', '0');
}
const quizData = [
  {
    topic: "Data Types",
    question: "Which of the following data types is used to store a decimal number with single precision in C?",
    options: ["int", "float", "char", "double"],
    correct: "float"
  },
  {
    topic: "Data Types",
    question: "What is the size of the int data type in C (on most systems)?",
    options: ["4 bytes", "8 bytes", "2 bytes", "1 byte"],
    correct: "4 bytes"
  },
  {
    topic: "Data Types",
    question: "Which of the following data types is used to store boolean values in C?",
    options: ["bool", "int", "char", "float"],
    correct: "bool"
  },
  {
    topic: "Variables",
    question: "What will happen if you try to use a variable without initializing it in C?",
    options: ["The program will give a compile-time error", "The program will give a runtime error", "The variable will have a garbage value", " The variable will automatically be initialized to 0"],
    correct: "The variable will have a garbage value"
  },
  {
    topic: "Variables",
    question: "Which of the following is the correct way to declare multiple variables of the same type in C?",
    options: ["int x, y, z;", "int x; int y; int z;", "int x = 1, y = 2, z = 3;", "All of the above"],
    correct: "All of the above"
  }
];



let currentQuestion = 0;
let score = 0;

const heroDialogue = document.getElementById('hero-dialogue');
const questionText = document.getElementById('question-text');
const optionsBox = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');

// Create Retry button
const retryBtn = document.createElement('button');
retryBtn.textContent = "Retry Quiz";
retryBtn.classList.add('next-btn', 'hidden');
retryBtn.style.marginTop = "10px"; // Some space between Next and Retry
retryBtn.onclick = retryQuiz;
document.querySelector('.quiz-container').appendChild(retryBtn);

function loadQuestion() {
  const q = quizData[currentQuestion];
  heroDialogue.textContent = `Topic: ${q.topic}`;
  questionText.textContent = q.question;
  optionsBox.innerHTML = "";

  q.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => selectAnswer(option, button);
    optionsBox.appendChild(button);
  });

  nextBtn.classList.add('hidden'); // Hide Next by default
}

const moveNextBtn = document.getElementById('move-next-btn');

function selectAnswer(selected, buttonClicked) {
  const correct = quizData[currentQuestion].correct;
  
  if (selected === correct) {
    score++;
    heroDialogue.textContent = "Well done! Keep it up!";
    buttonClicked.style.backgroundColor = "#4CAF50";
  } else {
    buttonClicked.style.backgroundColor = "#f44336";
  }

  buttonClicked.style.color = "white";

  // Disable all buttons
  Array.from(optionsBox.children).forEach(button => button.disabled = true);

  if (currentQuestion === quizData.length - 1) {
    // If it is the last question, show NEXT button
    nextBtn.classList.remove('hidden');
  } else {
    // If not last question, auto move to next
    setTimeout(() => {
      currentQuestion++;
      loadQuestion();
    }, 1000); // small delay so user sees correct/wrong color
  }
}


nextBtn.addEventListener('click', () => {
  endQuiz();
});


function endQuiz() {
  heroDialogue.textContent = "Quiz Completed!";
  questionText.textContent = `You scored ${score} out of ${quizData.length}! 🎉`;
  optionsBox.innerHTML = "";
  
  // Update totalScore
  let totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
  totalScore += score;
  localStorage.setItem('totalScore', totalScore);

  // Hide retry/next button
  nextBtn.style.display = "none";
  retryBtn.classList.add('hidden');

  // Show Move Next button
  moveNextBtn.classList.remove('hidden');
}

function retryQuiz() {
  // Remove last added score
  let totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
  totalScore -= score;
  localStorage.setItem('totalScore', totalScore);

  currentQuestion = 0;
  score = 0;
  loadQuestion();
  nextBtn.style.display = "inline-block";
  retryBtn.classList.add('hidden');
}

// Start the first question
loadQuestion();
moveNextBtn.addEventListener('click', () => {
  window.location.href = "C:/Users/selva/Desktop/game/chapter 1.html"; // <-- Put your next page link here
});