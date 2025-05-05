// DOM Elements
const elements = {
    level: document.getElementById("level"),
    exp: document.getElementById("exp"),
    expNeeded: document.getElementById("exp-needed"),
    expProgress: document.querySelector(".exp-progress"),
    playerHealthBar: document.querySelector(".player-health .current-health"),
    enemyHealthBar: document.querySelector(".enemy-health .current-health"),
    enemyName: document.getElementById("enemy-name"),
    enemyImg: document.getElementById("enemy-img"),
    questionText: document.getElementById("question-text"),
    playerAnswer: document.getElementById("player-answer"),
    submitBtn: document.getElementById("submit-btn"),
    hintText: document.getElementById("hint-text"),
    battleScreen: document.getElementById("battle-screen"),
    resultScreen: document.getElementById("result-screen"),
    resultMessage: document.getElementById("result-message"),
    restartBtn: document.getElementById("restart-btn"),
    solutionBtn: document.getElementById("solution-btn")
};
async function loadQuestionsFromServer(level) {
    // Validate input
    if (!['easy', 'medium', 'hard'].includes(level)) {
        console.warn(`Invalid level requested: ${level}`);
        return localQuestions[level] || [];
    }

    try {
        const response = await fetch(`http://localhost:3000/api/questions/${level}`);
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate the response structure
        if (!Array.isArray(data)) {
            throw new Error('Invalid response format: expected array');
        }
        
        return data;
        
    } catch (error) {
        console.error("Failed to load questions from server:", error.message);
        // Fallback to local questions
        return localQuestions[level] || []; 
    }
}
// Game State
const gameState = {
    playerLevel: 1,
    currentExp: 0,
    expNeeded: 100,
    playerHealth: 100,
    maxPlayerHealth: 100,
    enemyHealth: 100,
    currentEnemy: null,
    currentAnswers: [],
    currentHint: null,
    currentSolution: null,
    askedQuestions: [],
    currentEncounter: 0,
    enemiesDefeated: 0
};

// Enemy Sequence
const ENEMY_SEQUENCE = ["bug1", "bug2", "draugr", "ogre"];

// Enemies Config
const enemies = {
    bug1: {
        name: "Integer Bug",
        img: "bug.png",
        health: 100,
        damage: 5,
        exp: 10,
        questionsNeeded: 1,
        level: "easy",
        type: "datatypes"
    },
    bug2: {
        name: "Char Bug",
        img: "bug2.png",
        health: 100,
        damage: 5,
        exp: 10,
        questionsNeeded: 1,
        level: "easy",
        type: "datatypes"
    },
    draugr: {
        name: "Conditional Draugr",
        img: "draugr.png",
        health: 150,
        damage: 20,
        exp: 50,
        questionsNeeded: 2,
        level: "medium",
        type: "conditionals"
    },
    ogre: {
        name: "Type Ogre",
        img: "ogre.png",
        health: 300,
        damage: 40,
        exp: 75,
        questionsNeeded: 1,
        level: "hard",
        type: "advanced"
        
    }
};

// Questions Database
const questions = {
     easy: [
        {
            q: "Write a while loop that prints numbers from 1 to 5:",
            answer: [
              "int i = 1; while(i <= 5){ System.out.println(i); i++; }",
              "int i = 1; while(i < 5){ System.out.println(i); i++; }",
              "int i = 1; while(i <= 5){ System.out.println(i); i += 2; }",
              "int i = 1; while(i < 5){ System.out.println(i); i += 1; }"
            ],
            hint: "Use a while loop and increment by 1 to print each number.",
            solution: "int i = 1; while(i <= 5){ System.out.println(i); i++; }"
          },
          {
            q: "Write a while loop that prints 'Hello, world!' 3 times:",
            answer: [
              "int count = 0; while(count < 3){ System.out.println('Hello, world!'); count++; }",
              "int count = 1; while(count <= 3){ System.out.println('Hello, world!'); count++; }",
              "int count = 0; while(count < 3){ System.out.println('Hello, world!'); count--; }",
              "int count = 1; while(count < 3){ System.out.println('Hello, world!'); count++; }"
            ],
            hint: "Keep track of how many times the message has been printed.",
            solution: "int count = 0; while(count < 3){ System.out.println('Hello, world!'); count++; }"
          },
          {
            q: "Write a do-while loop that prints 'Good morning!' once:",
            answer: [
              "do{ System.out.println('Good morning!'); } while(false);",
              "do{ System.out.println('Good morning!'); } while(true);",
              "do{ System.out.println('Good morning!'); } while(1 == 0);",
              "do{ System.out.println('Good morning!'); } while(false);"
            ],
            hint: "A do-while loop runs the code at least once.",
            solution: "do{ System.out.println('Good morning!'); } while(false);"
          },
          {
            q: "Write a do-while loop that prints 'Welcome!' while a variable `x` is less than 3 (assuming `x = 0`):",
            answer: [
              "int x = 0; do{ System.out.println('Welcome!'); x++; } while(x < 3);",
              "int x = 0; do{ System.out.println('Welcome!'); x--; } while(x < 3);",
              "int x = 3; do{ System.out.println('Welcome!'); x++; } while(x < 3);",
              "int x = 0; do{ System.out.println('Welcome!'); x++; } while(x > 3);"
            ],
            hint: "Make sure `x` starts below 3 so that the loop continues.",
            solution: "int x = 0; do{ System.out.println('Welcome!'); x++; } while(x < 3);"
          },
          {
            q: "Write a while loop that prints numbers from 1 to 3:",
            answer: [
              "int i = 1; while(i <= 3){ System.out.println(i); i++; }",
              "int i = 1; while(i < 3){ System.out.println(i); i++; }",
              "int i = 1; while(i <= 3){ System.out.println(i); i += 2; }",
              "int i = 1; while(i < 3){ System.out.println(i); i++; }"
            ],
            hint: "Use a while loop with a condition that ensures it prints up to 3.",
            solution: "int i = 1; while(i <= 3){ System.out.println(i); i++; }"
          },
          {
            q: "Write a while loop that prints 'Hello!' 2 times:",
            answer: [
              "int count = 0; while(count < 2){ System.out.println('Hello!'); count++; }",
              "int count = 1; while(count <= 2){ System.out.println('Hello!'); count++; }",
              "int count = 0; while(count < 2){ System.out.println('Hello!'); count--; }",
              "int count = 1; while(count < 2){ System.out.println('Hello!'); count++; }"
            ],
            hint: "Keep track of the loop iterations with a variable like `count`.",
            solution: "int count = 0; while(count < 2){ System.out.println('Hello!'); count++; }"
          },
          {
            q: "Write a while loop that prints 'Goodbye!' when a variable `x` equals 3:",
            answer: [
              "int x = 3; while(x == 3){ System.out.println('Goodbye!'); break; }",
              "int x = 3; while(x < 3){ System.out.println('Goodbye!'); }",
              "int x = 2; while(x == 3){ System.out.println('Goodbye!'); x++; }",
              "int x = 3; while(x <= 3){ System.out.println('Goodbye!'); break; }"
            ],
            hint: "Make sure the condition checks if `x` equals 3 to start the loop.",
            solution: "int x = 3; while(x == 3){ System.out.println('Goodbye!'); break; }"
          },
          {
            q: "Write a while loop that prints numbers from 1 to 4:",
            answer: [
              "int i = 1; while(i <= 4){ System.out.println(i); i++; }",
              "int i = 0; while(i < 4){ System.out.println(i); i++; }",
              "int i = 1; while(i < 4){ System.out.println(i); i++; }",
              "int i = 2; while(i <= 4){ System.out.println(i); i++; }"
            ],
            hint: "Use a while loop and set the condition to print numbers until it reaches 4.",
            solution: "int i = 1; while(i <= 4){ System.out.println(i); i++; }"
          },
          {
            q: "Write a for loop that prints numbers from 1 to 3:",
            answer: [
              "for (int i = 1; i <= 3; i++) { System.out.println(i); }",
              "for (int i = 0; i < 3; i++) { System.out.println(i); }",
              "for (int i = 1; i <= 3; i--) { System.out.println(i); }",
              "for (int i = 1; i < 3; i++) { System.out.println(i); }"
            ],
            hint: "Use a for loop with a condition that prints from 1 to 3.",
            solution: "for (int i = 1; i <= 3; i++) { System.out.println(i); }"
          },
          {
            q: "Write a for loop that prints 'Hello!' 2 times:",
            answer: [
              "for (int count = 0; count < 2; count++) { System.out.println('Hello!'); }",
              "for (int count = 1; count <= 2; count++) { System.out.println('Hello!'); }",
              "for (int count = 0; count <= 2; count++) { System.out.println('Hello!'); }",
              "for (int count = 1; count < 2; count++) { System.out.println('Hello!'); }"
            ],
            hint: "Keep track of iterations using a variable like `count`.",
            solution: "for (int count = 0; count < 2; count++) { System.out.println('Hello!'); }"
          },
          {
            q: "Write a for loop that prints numbers from 1 to 5:",
            answer: [
              "for (int i = 1; i <= 5; i++) { System.out.println(i); }",
              "for (int i = 1; i < 5; i++) { System.out.println(i); }",
              "for (int i = 0; i <= 5; i++) { System.out.println(i); }",
              "for (int i = 1; i <= 6; i++) { System.out.println(i); }"
            ],
            hint: "Set the loop to run until the condition `i <= 5` is met.",
            solution: "for (int i = 1; i <= 5; i++) { System.out.println(i); }"
          },
          {
            q: "Write a for loop that prints 'Goodbye!' when a variable `x` equals 2:",
            answer: [
              "for (int x = 2; x == 2; x++) { System.out.println('Goodbye!'); }",
              "for (int x = 0; x == 2; x++) { System.out.println('Goodbye!'); }",
              "for (int x = 2; x < 3; x++) { System.out.println('Goodbye!'); }",
              "for (int x = 1; x == 2; x++) { System.out.println('Goodbye!'); }"
            ],
            hint: "Set the loop condition to ensure `x` equals 2 before printing.",
            solution: "for (int x = 2; x == 2; x++) { System.out.println('Goodbye!'); }"
          }   
    ],
    medium: [
       
        // Loops
        {
            q: "Write a for loop that runs exactly 5 times:",
            answer: [
                "for(int i=0;i<5;i++){}",
                "for (int i = 0; i < 5; i++) {}",
                "for(int i=0; i<5; i++){}"
            ],
            hint: "Pattern: for(int; condition; increment)",
            solution: "for (int i = 0; i < 5; i++) {}"
        },
        {
            q: "Write a for loop to print numbers from 1 to 5:",
            answer: [
              "for(int i = 1; i <= 5; i++){ System.out.println(i); }",
              "for(i = 1; i <= 5; i++){ System.out.println(i); }",
              "for(int i = 1; i < 6; i++){ System.out.println(i); }"
            ],
            hint: "Use for(int i = start; condition; increment).",
            solution: "for(int i = 1; i <= 5; i++){ System.out.println(i); }"
          },
          {
            q: "Write a for loop to print even numbers between 2 and 10 (inclusive):",
            answer: [
              "for(int i = 2; i <= 10; i += 2){ System.out.println(i); }",
              "for(i = 2; i <= 10; i += 2){ System.out.println(i); }",
              "for(int i = 2; i < 11; i += 2){ System.out.println(i); }"
            ],
            hint: "Start at 2 and increment by 2.",
            solution: "for(int i = 2; i <= 10; i += 2){ System.out.println(i); }"
          },
          {
            q: "Write a for loop to sum the numbers from 1 to 100:",
            answer: [
              "int sum = 0; for(int i = 1; i <= 100; i++){ sum += i; } System.out.println(sum);",
              "int sum = 0; for(i = 1; i <= 100; i++){ sum += i; } System.out.println(sum);",
              "int sum = 0; for(int i = 1; i < 101; i++){ sum += i; } System.out.println(sum);"
            ],
            hint: "Use a variable to keep track of the sum.",
            solution: "int sum = 0; for(int i = 1; i <= 100; i++){ sum += i; } System.out.println(sum);"
          },
          {
            q: "Write a for loop to print a multiplication table for 5 (from 1 to 10):",
            answer: [
              "for(int i = 1; i <= 10; i++){ System.out.println(5 + \" x \" + i + \" = \" + (5 * i)); }",
              "for(i = 1; i <= 10; i++){ System.out.println(5 + \" x \" + i + \" = \" + (5 * i)); }",
              "for(int i = 1; i < 11; i++){ System.out.println(5 + \" x \" + i + \" = \" + (5 * i)); }"
            ],
            hint: "Multiply the loop index with 5 in each iteration.",
            solution: "for(int i = 1; i <= 10; i++){ System.out.println(5 + \" x \" + i + \" = \" + (5 * i)); }"
          },
          {
            q: "Write a for loop to print a multiplication table for 5 (from 1 to 10):",
            answer: [
              "for(int i = 1; i <= 10; i++){ System.out.println(5 + \" x \" + i + \" = \" + (5 * i)); }",
              "for(i = 1; i <= 10; i++){ System.out.println(5 + \" x \" + i + \" = \" + (5 * i)); }",
              "for(int i = 1; i < 11; i++){ System.out.println(5 + \" x \" + i + \" = \" + (5 * i)); }"
            ],
            hint: "Multiply the loop index with 5 in each iteration.",
            solution: "for(int i = 1; i <= 10; i++){ System.out.println(5 + \" x \" + i + \" = \" + (5 * i)); }"
          },
          {
            q: "Write a do-while loop to keep asking the user to enter a number until they enter a number greater than 10:",
            answer: [
              "int num; do{ num = scanner.nextInt(); } while(num <= 10);",
              "int num = 0; do{ num = scanner.nextInt(); } while(num <= 10);",
              "int num; do{ num = scanner.nextInt(); } while(num < 10);",
              "int num = 0; do{ num = scanner.nextInt(); } while(num >= 10);"
            ],
            hint: "Keep prompting until the user enters a value greater than 10.",
            solution: "int num; do{ num = scanner.nextInt(); } while(num <= 10);"
          },
          {
            q: "Write a do-while loop that asks the user for input and prints it until they type 'stop':",
            answer: [
              "String input; do{ input = scanner.nextLine(); System.out.println(input); } while(!input.equals('stop'));",
              "String input = \"\"; do{ input = scanner.nextLine(); System.out.println(input); } while(input != \"stop\");",
              "String input; do{ input = scanner.next(); System.out.println(input); } while(input.equals('stop'));",
              "String input = \"\"; do{ input = scanner.nextLine(); System.out.println(input); } while(input == \"stop\");"
            ],
            hint: "Keep printing the user's input until they type 'stop'.",
            solution: "String input; do{ input = scanner.nextLine(); System.out.println(input); } while(!input.equals('stop'));"
          }
          
          

    ],
    hard: [
        {
            q: "Write a for loop to find the factorial of a number `n` (use `n = 5` as an example):",
            answer: [
              "int fact = 1; for(int i = 1; i <= n; i++){ fact *= i; } System.out.println(fact);",
              "int fact = 1; for(int i = 1; i < n; i++){ fact *= i; } System.out.println(fact);",
              "int fact = 1; for(int i = 1; i <= n; i++){ fact *= i; } System.out.println(fact);",
              "int fact = 1; for(int i = n; i >= 1; i--){ fact *= i; } System.out.println(fact);"
            ],
            hint: "Start with fact = 1 and multiply it by the loop index.",
            solution: "int fact = 1; for(int i = 1; i <= n; i++){ fact *= i; } System.out.println(fact);"
          },{
            q: "Write a for loop to reverse a string `input = 'hello'` and print the reversed string:",
            answer: [
              "String reversed = \"\"; for(int i = input.length() - 1; i >= 0; i--){ reversed += input.charAt(i); } System.out.println(reversed);",
              "String reversed = \"\"; for(int i = input.length(); i >= 0; i--){ reversed += input.charAt(i); } System.out.println(reversed);",
              "String reversed = \"\"; for(int i = input.length() - 1; i >= 0; i--){ reversed = input.charAt(i) + reversed; } System.out.println(reversed);",
              "String reversed = \"\"; for(int i = input.length(); i > 0; i--){ reversed = input.charAt(i) + reversed; } System.out.println(reversed);"
            ],
            hint: "Start from the last character and add each character to the new string.",
            solution: "String reversed = \"\"; for(int i = input.length() - 1; i >= 0; i--){ reversed += input.charAt(i); } System.out.println(reversed);"
          },
          {
            q: "Write a for loop to check if a number `n` is a prime number (use `n = 29` as an example):",
            answer: [
              "boolean isPrime = true; for(int i = 2; i <= Math.sqrt(n); i++){ if(n % i == 0){ isPrime = false; break; } } System.out.println(isPrime);",
              "boolean isPrime = true; for(int i = 2; i <= n; i++){ if(n % i == 0){ isPrime = false; break; } } System.out.println(isPrime);",
              "boolean isPrime = true; for(int i = 2; i < n; i++){ if(n % i == 0){ isPrime = false; break; } } System.out.println(isPrime);",
              "boolean isPrime = true; for(int i = 2; i <= n / 2; i++){ if(n % i == 0){ isPrime = false; break; } } System.out.println(isPrime);"
            ],
            hint: "A prime number has no divisors other than 1 and itself.",
            solution: "boolean isPrime = true; for(int i = 2; i <= Math.sqrt(n); i++){ if(n % i == 0){ isPrime = false; break; } } System.out.println(isPrime);"
          },
          {
            q: "Write a for loop to print the Fibonacci series up to the `n`th term (use `n = 10` as an example):",
            answer: [
              "int a = 0, b = 1; for(int i = 1; i <= n; i++){ System.out.print(a + \" \"); int next = a + b; a = b; b = next; }",
              "int a = 0, b = 1; for(int i = 1; i < n; i++){ System.out.print(a + \" \"); int next = a + b; a = b; b = next; }",
              "int a = 0, b = 1; for(int i = 1; i <= n; i++){ System.out.print(a + \" \"); int next = a + b; a = next; b = a; }",
              "int a = 0, b = 1; for(int i = 1; i <= n; i++){ System.out.print(a + \" \"); int next = a + b; a = b; b = next; }"
            ],
            hint: "Each number in the Fibonacci series is the sum of the previous two.",
            solution: "int a = 0, b = 1; for(int i = 1; i <= n; i++){ System.out.print(a + \" \"); int next = a + b; a = b; b = next; }"
          },
          {
            q: "Write a while loop to print all even numbers from 1 to `n` (use `n = 20` as an example):",
            answer: [
              "int i = 1; while(i <= n){ if(i % 2 == 0) System.out.println(i); i++; }",
              "int i = 2; while(i <= n){ System.out.println(i); i += 2; }",
              "int i = 2; while(i <= n){ System.out.println(i); i++; }",
              "int i = 0; while(i <= n){ if(i % 2 == 0) System.out.println(i); i++; }"
            ],
            hint: "Start with the first even number and increase by 2.",
            solution: "int i = 2; while(i <= n){ System.out.println(i); i += 2; }"
          },
          {
            q: "Write a while loop to find the greatest common divisor (GCD) of two numbers `a` and `b` (use `a = 56, b = 98` as examples):",
            answer: [
              "int temp; while(b != 0){ temp = b; b = a % b; a = temp; } System.out.println(a);",
              "int temp; while(a != 0){ temp = a; a = b % a; b = temp; } System.out.println(b);",
              "int temp; while(a != b){ if(a > b){ a = a - b; } else { b = b - a; } } System.out.println(a);",
              "int temp; while(a > 0){ b = b % a; if(b == 0){ break; } } System.out.println(a);"
            ],
            hint: "Use the Euclidean algorithm to find the GCD.",
            solution: "int temp; while(b != 0){ temp = b; b = a % b; a = temp; } System.out.println(a);"
          },
          {
            q: "Write a do-while loop to print a pattern of stars `n` times, where `n = 5` (i.e., print 5 stars in one line):",
            answer: [
              "int i = 1; do{ System.out.print('*'); i++; } while(i <= n);",
              "int i = 1; do{ System.out.print('*'); i++; } while(i < n);",
              "int i = 1; do{ System.out.println('*'); i++; } while(i <= n);",
              "int i = 1; do{ System.out.print('*'); i++; if(i == n) break; } while(true);"
            ],
            hint: "Use a counter that increments until it reaches `n`.",
            solution: "int i = 1; do{ System.out.print('*'); i++; } while(i <= n);"
          },
          {
            q: "Write a do-while loop that keeps asking the user for input until they type 'exit':",
            answer: [
              "String input; do{ input = scanner.nextLine(); } while(!input.equals('exit'));",
              "String input = \"\"; do{ input = scanner.nextLine(); } while(input != \"exit\");",
              "String input; do{ input = scanner.next(); } while(input != 'exit');",
              "String input = \"\"; do{ input = scanner.next(); } while(input.equals('exit'));"
            ],
            hint: "Keep asking the user until 'exit' is typed.",
            solution: "String input; do{ input = scanner.nextLine(); } while(!input.equals('exit'));"
          }, 
    ]
};

// Initialize the game
function initGame() {
  if (!elements.level || !elements.exp || !elements.playerHealthBar) {
      console.error("Critical UI elements missing!");
      return;
  }
  
  updateStats();
  setupEventListeners();
  startNextEncounter();
}

// Setup event listeners
function setupEventListeners() {
  if (elements.submitBtn) {
      elements.submitBtn.addEventListener("click", checkAnswer);
  }
  if (elements.restartBtn) {
      elements.restartBtn.addEventListener("click", resetGame);
  }
  if (elements.solutionBtn) {
      elements.solutionBtn.addEventListener("click", showSolution);
  }
}

// Start the next encounter in sequence
function startNextEncounter() {
  if (gameState.currentEncounter < ENEMY_SEQUENCE.length) {
      const enemyType = ENEMY_SEQUENCE[gameState.currentEncounter];
      startBattle(enemyType);
  } else {
      endModule();
  }
}

// Start battle with a specific enemy
function startBattle(enemyType) {
  const enemy = enemies[enemyType];
  gameState.currentEnemy = enemyType;
  gameState.enemyHealth = enemy.health;
  gameState.playerHealth = gameState.maxPlayerHealth;
  gameState.questionsAnswered = 0;
  
  // Update UI - ensure all elements exist before updating
  if (elements.enemyName) elements.enemyName.textContent = enemy.name;
  if (elements.enemyImg) elements.enemyImg.src = enemy.img;
  if (elements.enemyHealthBar) elements.enemyHealthBar.style.width = "100%";
  if (elements.playerHealthBar) elements.playerHealthBar.style.width = "100%";
  if (elements.hintText) elements.hintText.classList.add("hidden");
  
  // Show battle screen
  if (elements.battleScreen) elements.battleScreen.classList.remove("hidden");
  
  // Hide result screen if shown
  if (elements.resultScreen) elements.resultScreen.classList.add("hidden");
  
  // Ask first question
  askQuestion(enemyType);
}

// Ask a question appropriate for the enemy
async function askQuestion(enemyType) {
  const enemy = enemies[enemyType];
  
  // Use the function here
  const levelQuestions = await loadQuestionsFromServer(enemy.level);
  
  // Rest of your question handling logic...
  const question = levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
  elements.questionText.textContent = question.q;
  gameState.currentAnswers = question.answer;
  gameState.currentHint = question.hint;
  gameState.askedQuestions.push(question.q);
  gameState.currentSolution = question.solution;

  elements.playerAnswer.value = "";
  elements.playerAnswer.focus();
}
// Hero takes damage
function dealDamageToHero() {
  const hero = gameState.hero;  // Assuming this stores the hero's details
  gameState.heroHealth -= hero.damagePerAttack;  // Update health or damage taken
  elements.heroHealthBar.style.width = `${(gameState.heroHealth / hero.maxHealth) * 100}%`;

  // Add blink red effect to hero image
  if (elements.heroImg) {
      elements.heroImg.classList.add('blink-red');
  }

  // Remove blink effect after 4 seconds
  setTimeout(() => {
      if (elements.heroImg) {
          elements.heroImg.classList.remove('blink-red');
      }
  }, 4000);

  if (gameState.heroHealth <= 0) {
      endBattle(false);
  }
}

// Player deals damage to enemy
function dealDamage() {
  const enemy = enemies[gameState.currentEnemy];
  gameState.questionsAnswered++;

  const damage = enemy.health / enemy.questionsNeeded;
  gameState.enemyHealth = Math.max(0, gameState.enemyHealth - damage);
  elements.enemyHealthBar.style.width = `${(gameState.enemyHealth / enemy.health) * 100}%`;

  // Add blink red effect to enemy image
  if (elements.enemyImg) {
      elements.enemyImg.classList.add('blink-red');
  }

  // Remove blink effect after 4 seconds
  setTimeout(() => {
      if (elements.enemyImg) {
          elements.enemyImg.classList.remove('blink-red');
      }
  }, 4000);

  if (gameState.enemyHealth <= 0) {
      endBattle(true);
  } else if (gameState.questionsAnswered >= enemy.questionsNeeded) {
      gameState.enemyHealth = 0;
      elements.enemyHealthBar.style.width = "0%";
      endBattle(true);
  } else {
      setTimeout(enemyAttack, 1000);
  }
}


function cleanString(str) {
  return str.replace(/\s+/g, '').toLowerCase();  // Removes all spaces and converts to lowercase
}

// Check if player's answer is correct
function checkAnswer() {
 // Get the player's answer from the textarea
 const playerAnswer = elements.playerAnswer.value
 .trim()                    // Remove leading/trailing whitespace
 .toLowerCase()              // Normalize case
 .split('\n')                // Split by new lines
 .map(line => line.trim())   // Trim each line (remove extra spaces)
 .filter(line => line !== ""); // Filter out empty lines

// Compare the cleaned-up player answer with the correct answers
const isCorrect = gameState.currentAnswers.some(correctAnswer => 
 cleanString(playerAnswer.join("\n")) === cleanString(correctAnswer)
);

if (isCorrect) {
 dealDamage();
} else {
 elements.hintText.textContent = "Hint: " + gameState.currentHint;
 elements.hintText.classList.remove("hidden");
 enemyAttack();
}
;

if (isCorrect) {
 dealDamage();
} else {
 elements.hintText.textContent = "Hint: " + gameState.currentHint;
 elements.hintText.classList.remove("hidden");
 enemyAttack();
}
}

// Player deals damage to enemy
function dealDamage() {
  const enemy = enemies[gameState.currentEnemy];
  gameState.questionsAnswered++;

  const damage = enemy.health / enemy.questionsNeeded;
  gameState.enemyHealth = Math.max(0, gameState.enemyHealth - damage);
  elements.enemyHealthBar.style.width = `${(gameState.enemyHealth / enemy.health) * 100}%`;

  if (gameState.enemyHealth <= 0) {
      endBattle(true);
  } else if (gameState.questionsAnswered >= enemy.questionsNeeded) {
      gameState.enemyHealth = 0;
      elements.enemyHealthBar.style.width = "0%";
      endBattle(true);
  } else {
      setTimeout(enemyAttack, 1000);
  }
}


// Enemy attacks player
function enemyAttack() {
  const enemy = enemies[gameState.currentEnemy];
  gameState.playerHealth = Math.max(0, gameState.playerHealth - enemy.damage);
  elements.playerHealthBar.style.width = `${(gameState.playerHealth / gameState.maxPlayerHealth) * 100}%`;

  if (gameState.playerHealth <= 0) {
      endBattle(false);
  } else {
      askQuestion(gameState.currentEnemy);
  }
}

// End battle (win or lose)
function endBattle(playerWon) {
  if (playerWon) {
      rewardExp(enemies[gameState.currentEnemy].exp);
      gameState.currentEncounter++;
      setTimeout(startNextEncounter, 1500);
  } else {
      alert("Defeated! Practice more and try again.");
      // Call resetGame when the player loses
      setTimeout(resetGame, 1500);
  }
  
}

// Reward EXP and check for level up
function rewardExp(exp) {
  gameState.currentExp += exp;
  updateStats(); // Update first so you see exp bar filling

  while (gameState.currentExp >= gameState.expNeeded) {
      gameState.currentExp -= gameState.expNeeded;
      gameState.playerLevel++;
      gameState.expNeeded = Math.floor(gameState.expNeeded * 1.5);
      gameState.maxPlayerHealth += 20;
      gameState.playerHealth = gameState.maxPlayerHealth;
      updateStats();
      showLevelUpPopup(gameState.playerLevel); // Replace alert!
  }
}
function showLevelUpPopup(level) {
  const popup = document.createElement("div");
  popup.textContent = `Level Up! 🎉 Level ${level}`;
  popup.style.position = "absolute";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.background = "white";
  popup.style.color = "black";
  popup.style.padding = "20px";
  popup.style.border = "2px solid black";
  popup.style.borderRadius = "10px";
  popup.style.fontSize = "24px";
  popup.style.zIndex = 9999;
  document.body.appendChild(popup);

  setTimeout(() => {
      popup.remove();
  }, 2000); // Show for 2 seconds
}
// Level up player
function levelUp() {
  gameState.playerLevel++;
  gameState.currentExp -= gameState.expNeeded;
  gameState.expNeeded = Math.floor(gameState.expNeeded * 1.5);
  gameState.maxPlayerHealth += 20;
  gameState.playerHealth = gameState.maxPlayerHealth;
}

// End module
function endModule() {
  alert("Module Complete! You've mastered:\n\n- Basic Data Types\n- Conditional Logic\n- Loops\n\nReturn to the castle for new challenges!");
  gameState.currentEncounter = 0;
  gameState.currentExp = 0;
  gameState.expNeeded = 100;
  gameState.playerLevel = 1;
  updateStats();
  startNextEncounter();
}

// Update UI stats
function updateStats() {
  if (!elements.level || !elements.exp || !elements.expNeeded || !elements.expProgress) {
      console.error("Missing stats UI elements");
      return;
  }
  
  elements.level.textContent = gameState.playerLevel;
  elements.exp.textContent = gameState.currentExp;
  elements.expNeeded.textContent = gameState.expNeeded;
  elements.expProgress.style.width = `${(gameState.currentExp / gameState.expNeeded) * 100}%`;
  
  if (elements.playerHealthBar) {
      elements.playerHealthBar.style.width = `${(gameState.playerHealth / gameState.maxPlayerHealth) * 100}%`;
  }
}

// Start the game when page loads
window.onload = function() {
  // Double-check DOM is ready
  if (document.readyState === "complete") {
      initGame();
  } else {
      document.addEventListener("DOMContentLoaded", initGame);
  }
};

function resetGame() {
  // Reset the game state to its initial values
  gameState.playerLevel = 1;
  gameState.currentExp = 0;
  gameState.expNeeded = 100;
  gameState.playerHealth = 100;
  gameState.maxPlayerHealth = 100;
  gameState.enemyHealth = 100;
  gameState.currentEnemy = null;
  gameState.currentAnswers = [];
  gameState.currentHint = null;
  gameState.currentSolution = null;
  gameState.askedQuestions = [];
  gameState.currentEncounter = 0;
  gameState.enemiesDefeated = 0;

  // Update UI stats
  updateStats();

  // Hide result screen if visible
  if (elements.resultScreen) elements.resultScreen.classList.add("hidden");

  // Start the first encounter
  startNextEncounter();
}


function showSolution() {
  if (!gameState.currentSolution) {
      console.error("No solution available!");
      alert("No solution available for this question.");
      return;
  }

  // Display solution in an alert or modal
  alert(`Correct Solution:\n\n${gameState.currentSolution}`);

  // Alternative: Display in the UI (e.g., a popup or hint box)
  // elements.hintText.textContent = `Solution: ${gameState.currentSolution}`;
  // elements.hintText.classList.remove("hidden");
}
function endModule() {
  // Optional: show a message or animation before redirect
  alert("Module Complete! You've mastered:\n\n- Basic Data Types\n- variables\n- input and output statement");

  // Redirect to another page (e.g., summary.html or nextModule.html)
  window.location.href = "../../chapter page.html";
}