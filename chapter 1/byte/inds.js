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
        // Variables
        {
            q: "Declare an integer variable named 'gold' and set it to 50:",
            answer: [
                "int gold = 50;",
                "int gold= 50;",
                "int gold=50;",
                "int gold =50;",
                "int \ngold = 50;"
            ],
            hint: "Format: 'int variablename = value;' (spaces don't matter)",
            solution: "int gold = 50;"
        },
        {
            q: "Fix this code to store age (whole number):\n___ age = 25;",
            answer: [
                "int age = 25;",
                "int age=25;",
                "int \nage = 25;",
                "int\nage = 25;"
            ],
            hint: "Use 'int' for whole numbers",
            solution: "int age = 25;"
        },
        {
            q: "Declare a char variable named 'symbol' containing '$':",
            answer: [
                "char symbol = '$';",
                "char symbol='$';",
                "char \nsymbol = '$';"
            ],
            hint: "Chars use single quotes like '$'",
            solution: "char symbol = '$';"
        },
        // Situation: Game Development
        {
            q: "You're making a game. Declare a boolean variable 'gameOver' and set it to false:",
            answer: [
                "boolean gameOver = false;",
                "boolean gameOver=false;",
                "boolean \ngameOver = false;"
            ],
            hint: "Booleans can be true or false",
            solution: "boolean gameOver = false;"
        },
        // Basic Operations
        {
            q: "Calculate the sum of two integers (a=5, b=3) and store in 'total':",
            answer: [
                "int total = 5 + 3;",
                "int total=5+3;",
                "int a=5,b=3; int total=a+b;"
            ],
            hint: "Use the + operator",
            solution: "int total = 5 + 3;"
        }
    ],
    medium: [
        // Conditionals
        {
            q: "Write an if statement checking if 'health' is less than 20:",
            answer: [
                "if(health < 20){}",
                "if (health < 20) {}",
                "if( health < 20 ) {}",
                "if \n(health < 20){}"
            ],
            hint: "Structure: if(condition){}",
            solution: "if (health < 20) {}"
        },
        {
            q: "Write an if-else statement that checks if 'score' is 100 or more:",
            answer: [
                "if(score >= 100){} else{}",
                "if (score >= 100) {} else {}",
                "if( score >= 100 ){} else {}"
            ],
            hint: ">= means 'greater than or equal to'",
            solution: "if (score >= 100) {} else {}"
        },
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
        // Situation: E-commerce
        {
            q: "Calculate discounted price (20% off) for a product costing $50:",
            answer: [
                "double discountedPrice = 50 * 0.8;",
                "double original=50; double discounted=original*0.8;",
                "final double DISCOUNT=0.8; double price=50*DISCOUNT;"
            ],
            hint: "20% off means paying 80% of original",
            solution: "double discountedPrice = 50 * 0.8;"
        },
        // Arrays
        {
            q: "Declare an integer array named 'scores' with 3 elements:",
            answer: [
                "int[] scores = new int[3];",
                "int []scores=new int[3];",
                "int[] scores=new int[3];"
            ],
            hint: "Format: type[] name = new type[size];",
            solution: "int[] scores = new int[3];"
        }
    ],
    hard: [
        // Complex Loops
        {
            q: "Write a while loop that runs while 'power' is greater than 0:",
            answer: [
                "while(power > 0){}",
                "while (power > 0) {}",
                "while(power>0){}"
            ],
            hint: "Similar to if-statement syntax",
            solution: "while (power > 0) {}"
        },
        {
            q: "Write a nested for loop (3x3 grid pattern):",
            answer: [
                "for(int i=0;i<3;i++){ for(int j=0;j<3;j++){} }",
                "for (int i=0; i<3; i++) { for (int j=0; j<3; j++) {} }"
            ],
            hint: "One loop inside another",
            solution: "for(int i=0;i<3;i++){ for(int j=0;j<3;j++){} }"
        },
        // Data Types
        {
            q: "Declare a float variable 'temperature' with value 98.6:",
            answer: [
                "float temperature = 98.6f;",
                "float temperature=98.6f;",
                "float temperature \n = 98.6f;"
            ],
            hint: "Don't forget the 'f' suffix",
            solution: "float temperature = 98.6f;"
        },
        // Situation: Banking System
        {
            q: "Calculate compound interest (principal=1000, rate=5%, years=3):",
            answer: [
                "double amount = 1000 * Math.pow(1 + 0.05, 3);",
                "double principal=1000; double rate=0.05; int years=3; double amount=principal*Math.pow(1+rate,years);"
            ],
            hint: "Use Math.pow() for exponents",
            solution: "double amount = 1000 * Math.pow(1 + 0.05, 3);"
        },
        // Methods
        {
            q: "Write a method 'isEven' that takes an integer and returns true if it's even:",
            answer: [
                "boolean isEven(int num){ return num%2==0; }",
                "boolean isEven(int num) { return num % 2 == 0; }",
                "public boolean isEven(int num){return num%2==0;}"
            ],
            hint: "Use modulo operator %",
            solution: "boolean isEven(int num) { return num % 2 == 0; }"
        }
    ],
    situational: [
        {
            q: "Game Development: When player collects coin, increment 'score' by 10:",
            answer: [
                "score += 10;",
                "score = score + 10;",
                "score+=10;"
            ],
            hint: "Shortcut: += operator",
            solution: "score += 10;"
        },
        {
            q: "E-commerce: Apply 10% tax to subtotal of $45.50:",
            answer: [
                "double total = 45.50 * 1.10;",
                "double subtotal=45.50; double total=subtotal*1.10;"
            ],
            hint: "10% tax = multiply by 1.10",
            solution: "double total = 45.50 * 1.10;"
        },
        {
            q: "Weather App: Convert Celsius (22.5) to Fahrenheit:",
            answer: [
                "double fahrenheit = 22.5 * 9/5 + 32;",
                "double celsius=22.5; double fahr=celsius*9/5+32;"
            ],
            hint: "Formula: (C × 9/5) + 32",
            solution: "double fahrenheit = 22.5 * 9/5 + 32;"
        },
        {
            q: "Social Media: Check if username length is between 5-15 characters:",
            answer: [
                "if(username.length() >=5 && username.length() <=15){}",
                "if (username.length()>=5 && username.length()<=15) {}"
            ],
            hint: "Use && for AND condition",
            solution: "if(username.length() >=5 && username.length() <=15){}"
        }
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