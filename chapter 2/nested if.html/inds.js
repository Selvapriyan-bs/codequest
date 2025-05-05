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
            q: "Write a nested if statement that checks if `x` is greater than 5 and if `y` is less than 10, then prints 'Condition met':",
            answer: [
              "if (x > 5) { if (y < 10) { console.log('Condition met'); } }",
              "if (x > 5 && y < 10) { console.log('Condition met'); }",
              "if (x < 5) { if (y > 10) { console.log('Condition met'); } }",
              "if (x > 5) { if (y > 10) { console.log('Condition met'); } }"
            ],
            hint: "Use the first `if` to check `x`, then nest the second `if` to check `y`.",
            solution: "if (x > 5) { if (y < 10) { console.log('Condition met'); } }"
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
        {
            q: "Write a nested if statement that checks if `age` is greater than 18, and if `isStudent` is true, then print 'Eligible for student discount':",
            answer: [
              "if (age > 18) { if (isStudent) { console.log('Eligible for student discount'); } }",
              "if (age >= 18 && isStudent) { console.log('Eligible for student discount'); }",
              "if (age > 18) { if (isStudent == false) { console.log('Eligible for student discount'); } }",
              "if (age < 18) { if (isStudent) { console.log('Eligible for student discount'); } }"
            ],
            hint: "Check `age` first, and then check if the person is a student using a second `if`.",
            solution: "if (age > 18) { if (isStudent) { console.log('Eligible for student discount'); } }"
          },
          {
            q: "Write a nested if statement to check if `temperature` is above 30 and `isRaining` is false, then print 'Perfect day for a walk!':",
            answer: [
              "if (temperature > 30) { if (!isRaining) { console.log('Perfect day for a walk!'); } }",
              "if (temperature < 30 && isRaining == false) { console.log('Perfect day for a walk!'); }",
              "if (temperature > 30 && !isRaining) { console.log('Perfect day for a walk!'); }",
              "if (temperature > 30) { if (isRaining) { console.log('Perfect day for a walk!'); } }"
            ],
            hint: "First, check the temperature, then check the rain condition using `!isRaining`.",
            solution: "if (temperature > 30) { if (!isRaining) { console.log('Perfect day for a walk!'); } }"
          },
          {
            q: "Write a nested if statement to check if `x` is even and `y` is greater than 10, then print 'Valid values':",
            answer: [
              "if (x % 2 == 0) { if (y > 10) { console.log('Valid values'); } }",
              "if (x % 2 != 0 && y > 10) { console.log('Valid values'); }",
              "if (x % 2 == 0) { if (y < 10) { console.log('Valid values'); } }",
              "if (x % 2 == 1 && y > 10) { console.log('Valid values'); }"
            ],
            hint: "Use `x % 2 == 0` to check if `x` is even, then check if `y` is greater than 10.",
            solution: "if (x % 2 == 0) { if (y > 10) { console.log('Valid values'); } }"
          }      
    ],
    medium :[
        {
            q: "Write an if-else statement that checks if 'score' is above or equal to 50. If it is, print 'Passed'; otherwise, print 'Failed':",
            answer: [
              "if(score >= 50){ System.out.println(\"Passed\"); } else { System.out.println(\"Failed\"); }",
              "if (score >= 50) { System.out.println(\"Passed\"); } else { System.out.println(\"Failed\"); }",
              "if(score>=50){System.out.println(\"Passed\");}else{System.out.println(\"Failed\");}"
            ],
            hint: "Use if (condition) { } else { } and remember to use double quotes in println",
            solution: "if (score >= 50) { System.out.println(\"Passed\"); } else { System.out.println(\"Failed\"); }"
          },
          {
            q: "Write an if-else statement to check if 'temperature' is below 0. If true, print 'Freezing'; else print 'Not freezing':",
            answer: [
              "if(temperature < 0){ System.out.println(\"Freezing\"); } else { System.out.println(\"Not freezing\"); }",
              "if (temperature < 0) { System.out.println(\"Freezing\"); } else { System.out.println(\"Not freezing\"); }",
              "if(temperature<0){System.out.println(\"Freezing\");}else{System.out.println(\"Not freezing\");}"
            ],
            hint: "Use if (condition) { } else { } and println statements.",
            solution: "if (temperature < 0) { System.out.println(\"Freezing\"); } else { System.out.println(\"Not freezing\"); }"
          },
          {
            q: "Write an if-else statement to check if 'points' is greater than 100. If true, print 'Level Up'; else print 'Keep Trying':",
            answer: [
              "if(points > 100){ System.out.println(\"Level Up\"); } else { System.out.println(\"Keep Trying\"); }",
              "if (points > 100) { System.out.println(\"Level Up\"); } else { System.out.println(\"Keep Trying\"); }",
              "if(points>100){System.out.println(\"Level Up\");}else{System.out.println(\"Keep Trying\");}"
            ],
            hint: "Simple if-else. Compare using > and use println with quotes.",
            solution: "if (points > 100) { System.out.println(\"Level Up\"); } else { System.out.println(\"Keep Trying\"); }"
          }
          
                
    ],
    hard: [
        {
            q: "Write a nested if statement that checks if 'age' is 18 or older. If true, then check if 'hasID' is true. If both conditions are true, print 'Access granted':",
            answer: [
              "if(age >= 18){ if(hasID){ System.out.println(\"Access granted\"); } }",
              "if (age >= 18) { if (hasID) { System.out.println(\"Access granted\"); } }",
              "if(age>=18){if(hasID){System.out.println(\"Access granted\");}}"
            ],
            hint: "One if statement inside another. Make sure to close all brackets.",
            solution: "if (age >= 18) { if (hasID) { System.out.println(\"Access granted\"); } }"
          },
          {
            q: "Write a nested if statement that checks if 'age' is 18 or older. If true, then check if 'hasID' is true. If both conditions are true, print 'Access granted':",
            answer: [
              "if(age >= 18){ if(hasID){ System.out.println(\"Access granted\"); } }",
              "if (age >= 18) { if (hasID) { System.out.println(\"Access granted\"); } }",
              "if(age>=18){if(hasID){System.out.println(\"Access granted\");}}"
            ],
            hint: "One if statement inside another. Make sure to close all brackets.",
            solution: "if (age >= 18) { if (hasID) { System.out.println(\"Access granted\"); } }"
          },
          {
            q: "Write a nested if statement to check if `score` is greater than 50 and if `level` is 3 or higher, then print 'Level 3: You passed with a decent score'. If `score` is greater than 75, print 'Level 3: You passed with an excellent score'.",
            answer: [
              "if (score > 50) { if (level >= 3) { if (score > 75) { console.log('Level 3: You passed with an excellent score'); } else { console.log('Level 3: You passed with a decent score'); } } }",
              "if (score > 50 && level >= 3) { if (score > 75) { console.log('Level 3: You passed with an excellent score'); } else { console.log('Level 3: You passed with a decent score'); } }",
              "if (score > 50) { if (level > 3) { console.log('Level 3: You passed with a decent score'); } }",
              "if (score < 50) { if (level >= 3) { console.log('Level 3: You passed with an excellent score'); } }"
            ],
            hint: "Check if `score` is above 50 first, then check `level`. Use a nested `if` to check if `score` is above 75.",
            solution: "if (score > 50) { if (level >= 3) { if (score > 75) { console.log('Level 3: You passed with an excellent score'); } else { console.log('Level 3: You passed with a decent score'); } } }"
          },
          {
            q: "Write a nested if statement to check if `age` is between 18 and 25 and if `isStudent` is true, print 'You qualify for the youth discount'. If `age` is between 26 and 40 and `isEmployed` is true, print 'You qualify for the working adult discount'. If `age` is greater than 40 and `isSenior` is true, print 'You qualify for the senior citizen discount'.",
            answer: [
              "if (age >= 18 && age <= 25) { if (isStudent) { console.log('You qualify for the youth discount'); } } else if (age >= 26 && age <= 40) { if (isEmployed) { console.log('You qualify for the working adult discount'); } } else if (age > 40) { if (isSenior) { console.log('You qualify for the senior citizen discount'); } }",
              "if (age >= 18 && age <= 25 && isStudent) { console.log('You qualify for the youth discount'); } else if (age >= 26 && age <= 40 && isEmployed) { console.log('You qualify for the working adult discount'); } else if (age > 40 && isSenior) { console.log('You qualify for the senior citizen discount'); }",
              "if (age < 18) { if (isStudent) { console.log('You qualify for the youth discount'); } } else if (age > 25) { if (isEmployed) { console.log('You qualify for the working adult discount'); } else if (isSenior) { console.log('You qualify for the senior citizen discount'); } }",
              "if (age < 18) { if (isSenior) { console.log('You qualify for the senior citizen discount'); } } else if (age > 40) { if (isStudent) { console.log('You qualify for the youth discount'); } }"
            ],
            hint: "Use multiple `else if` conditions to check different age ranges and eligibility statuses.",
            solution: "if (age >= 18 && age <= 25) { if (isStudent) { console.log('You qualify for the youth discount'); } } else if (age >= 26 && age <= 40) { if (isEmployed) { console.log('You qualify for the working adult discount'); } } else if (age > 40) { if (isSenior) { console.log('You qualify for the senior citizen discount'); } }"
          },
          {
            q: "Write a nested if statement that checks if the variable `balance` is greater than 1000. If true, then check if `hasCreditCard` is true, and if the `creditScore` is greater than 750, print 'You qualify for the premium package'. If `creditScore` is less than or equal to 750, print 'You qualify for the standard package'. If `hasCreditCard` is false, print 'Credit card required for premium package'. If `balance` is less than or equal to 1000, print 'Balance is insufficient to qualify for the package'.",
            answer: [
              "if (balance > 1000) { if (hasCreditCard) { if (creditScore > 750) { console.log('You qualify for the premium package'); } else { console.log('You qualify for the standard package'); } } else { console.log('Credit card required for premium package'); } } else { console.log('Balance is insufficient to qualify for the package'); }",
              "if (balance > 1000 && hasCreditCard) { if (creditScore > 750) { console.log('You qualify for the premium package'); } else { console.log('You qualify for the standard package'); } } else { console.log('Balance is insufficient to qualify for the package'); }",
              "if (balance <= 1000) { if (hasCreditCard) { console.log('Credit card required for premium package'); } else { console.log('Balance is insufficient to qualify for the package'); } }",
              "if (balance > 1000) { if (hasCreditCard == false) { console.log('Credit card required for premium package'); } }"
            ],
            hint: "Start by checking if the balance is sufficient, then check if the user has a credit card and credit score.",
            solution: "if (balance > 1000) { if (hasCreditCard) { if (creditScore > 750) { console.log('You qualify for the premium package'); } else { console.log('You qualify for the standard package'); } } else { console.log('Credit card required for premium package'); } } else { console.log('Balance is insufficient to qualify for the package'); }"
          },
          {
            q: "Write a nested if statement that checks if `itemCount` is greater than 0, and if `itemType` is 'electronic', check if `warranty` is valid (i.e., `warranty` is true), then print 'Eligible for return'. If `itemType` is 'clothing', check if the `returnWindow` is less than 30 days, then print 'Eligible for return'. If the `itemCount` is 0, print 'No items to return'.",
            answer: [
              "if (itemCount > 0) { if (itemType === 'electronic') { if (warranty) { console.log('Eligible for return'); } } else if (itemType === 'clothing') { if (returnWindow < 30) { console.log('Eligible for return'); } } } else { console.log('No items to return'); }",
              "if (itemCount > 0) { if (itemType === 'electronic' && warranty) { console.log('Eligible for return'); } else if (itemType === 'clothing' && returnWindow < 30) { console.log('Eligible for return'); } } else { console.log('No items to return'); }",
              "if (itemCount <= 0) { console.log('No items to return'); } else { if (itemType === 'electronic') { if (warranty) { console.log('Eligible for return'); } } else { if (itemType === 'clothing') { if (returnWindow < 30) { console.log('Eligible for return'); } } } }",
              "if (itemCount > 0) { if (itemType === 'electronic') { if (returnWindow < 30) { console.log('Eligible for return'); } } else { if (itemType === 'clothing') { if (warranty) { console.log('Eligible for return'); } } } } else { console.log('No items to return'); }"
            ],
            hint: "First check if there are items to return, then add conditions for each `itemType` and their specific return requirements.",
            solution: "if (itemCount > 0) { if (itemType === 'electronic') { if (warranty) { console.log('Eligible for return'); } } else if (itemType === 'clothing') { if (returnWindow < 30) { console.log('Eligible for return'); } } } else { console.log('No items to return'); }"
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