if (localStorage.getItem('totalScore') === null) {
  localStorage.setItem('totalScore', '0');
}
const quizData = [
  {
    topic: "Basic Input and Output",
    question: "Which function is used to read input from the user in C?",
    options: ["scanf()", "printf()", "getchar()", "input()"],
    correct: "scanf()"
  },
  {
    topic: "Basic Input and Output",
    question: "Which of the following is the correct syntax to print a string in C?",
    options: ["print;", "printf;", "echo", "out"],
    correct: "printf;"
  },
  {
    topic: "Basic Input and Output",
    question: "What is the correct way to read an integer from the user in C?",
    options: ["scanf", "scan", "touch", "in"],
    correct: "scanf"
  },
  {
    topic: "Basic Input and Output",
    question: "Which of the following statements is correct about the printf() function?",
    options: ["It is used to display output on the screen", "It reads input from the user", "It is used for string comparison", " It stores data in variables"],
    correct: "It is used to display output on the screen"
  },
  {
    topic: "Basic Input and Output",
    question: "What is the purpose of the & operator in the scanf() function in C?",
    options: ["It is used to display output", "It indicates the address of the variable to store the input", "It assigns a value to a variable", "It is used for logical operations"],
    correct: "It indicates the address of the variable to store the input"
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
alert("you have succesfully completed the datatype and variable (or) chapter 1")
moveNextBtn.addEventListener('click', () => {
  window.location.href = "C:/Users/selva/Desktop/game/chapter 1/byte/inds.html"; // <-- Put your next page link here
});