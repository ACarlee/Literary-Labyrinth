document.getElementById("start-button").addEventListener("click", () => {
  document.getElementById("title-page").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
});

const gameFlow = {//this is the number of questions to skip until the one that pertains to the plyer's specific game. These hard coded values are the cost of having organized .json files
  "chapter1": [
    [1, 1], 
    [1, 1],
    [1, 1], 
    [0, 0]
  ],
  "chapter2": [
    [1, 4, 8, 11],
    [1,2],
    [12, 0],
    [0],
    [1,3],
    [8,1],
    [6,0],
    [5,0],
    [1,2],
    [3,0],
    [0],
    [4,0],
    [0,0],
    [0,0],
    [0],
    [0,0]
  ],
  "chapter3":[
    [1,2],
    [2,3],
    [1,3],
    [3],
    [2],
    [1],
    [1,2],
    [2,2],
    [1],
    [1,2,3],
    [0],
    [0],
    [0]
  ], 
  "chapter4":[
    [1,2],
    [2],
    [0],
    [1,2],
    [0],
    [1,2,3],
    [0],
    [0],
    [1,2,3],
    [0],
    [0],
    [0]
  ],
  "chapter5":[
    [1,2],
    [2,3],
    [0],
    [2,1],
    [2,3,4],
    [-1],
    [3,3],
    [0,0],
    [0],
    [0]
  ],
  "chapter6":[
    [1,2],
    [1],
    [1,2,3],
    [3],
    [2],
    [1],
    [1,2],
    [0],
    [0]
  ],
    "chapter7": [
      [1,2],
      [2,2],
      [0],
      [1,1],
      [1,2],
      [2,3],
      [0],
      [0],
      [0]
    ],
    "chapter8":[
      [1,2],
      [0],
      [2,3,1],
      [0],
      [0],
      [1,-4],
      [1,2],
      [0],
      [2,1],
      [0],
      [0]
    ],
    "chapter9":[
      [1,1],
      [1,1,1],
      [1,2,2],
      [0],
      [1,2],
      [2,3],
      [2,2],
      [0],
      [0]
    ],
    "chapter10":[
      [1,1],
      [1,2,3],
      [3,3],
      [2,2],
      [1,1],
      [1],
      [1,2,3],
      [0],
      [0],
      [1,2],
      [0],
      [0]
    ]
};

document.addEventListener("DOMContentLoaded", async () => {
  const log = document.getElementById("log");
  const question = document.getElementById("question");
  const choices = document.querySelector(".choices");

  class Player {
    constructor() {
      this.traits = { wishful : 0, fearful: 0, empathy : 0, ambition : 0, honor: 0, pride: 0};
      this.currentChapter = "chapter1";
      this.lastchoice = -1;
      this.finish = false;
    }

    updateTrait(trait, value) {
      this.traits[trait] = (this.traits[trait] || 0) + value;
    }
  }

  const player = new Player();

  async function loadChapter(chapterId) {
    try {
      const response = await fetch(`json/${chapterId}.json`);
      if (!response.ok) throw new Error(`Failed to load ${chapterId}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function startChapter() {
    if (player.finish) return;
  
    const nextChapter = adjustChapter(player.currentChapter);
    player.currentChapter = nextChapter; // Update based on traits
    revealChapter(player.currentChapter);
    const chapter = await loadChapter(player.currentChapter);
    if (!chapter) {
      logMessage("Error loading chapter. Game ending.");
      player.finish = true;
      return;
    }

    if (chapter.questions) {
      let currentQuestionIndex = 0;
  
      const displayNextQuestion = () => {
        if (currentQuestionIndex >= chapter.questions.length) {
          logMessage("Scene complete.");
          return;
        }
        
      const questionData = chapter.questions[currentQuestionIndex];
      displayQuestion(questionData, () => {                        
      let step = gameFlow[player.currentChapter][currentQuestionIndex][player.lastchoice]; 
      currentQuestionIndex = currentQuestionIndex + step;
      displayNextQuestion();  // Show the next question
  });

      };
  
      displayNextQuestion();
    } else {
      displayQuestion(chapter, () => {
        if (chapter.next === "finish") {
          player.finish = true;
          logMessage("The game has ended.");
        } else {
          player.currentChapter = chapter.next;
          startChapter();
        }
      });
    }
  }  

  function adjustChapter(nextChapter){//more cases will be added here in the future
    if (nextChapter === "chapter2" && player.traits["fearful"] >= 1) {
        return "chapter3"; // Redirect to chapter3 if "fearful" trait is 1 or more
      }
    
    return nextChapter;
  }

  function revealChapter(nextChapter) {
    if (nextChapter === "chapter2") {
      MapManager.revealChapter("chapter2");
    }
    if (nextChapter === "chapter3"){
      MapManager.revealChapter("chapter3");
    }
    if (nextChapter === "chapter4"){
      MapManager.revealChapter("chapter4");
    }
    if (nextChapter === "chapter5"){
      MapManager.revealChapter("chapter5");
    }
    if (nextChapter === "chapter6"){
      MapManager.revealChapter("chapter6");
    }
    if (nextChapter === "chapter7"){
      MapManager.revealChapter("chapter7");
    }
    if (nextChapter === "chapter8"){
      MapManager.revealChapter("chapter8");
    }
    if (nextChapter === "chapter9"){
      MapManager.revealChapter("chapter9");
    }
    if (nextChapter === "chapter10"){
      MapManager.revealChapter("chapter10");
    }
  }
  
  function displayQuestion(questionData, onComplete) {
    question.textContent = questionData.question;
    choices.innerHTML = "";
  
    questionData.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.textContent = choice.text;
  
      // Add a special behavior for the "No" button in q3 of chapter1
if (player.currentChapter === "chapter1" && questionData.question === "That is quite an answer. Do you hate womankind?" && choice.id === "no-button") {
  button.setAttribute("id", "no-button");
  
  // Set a fixed size for the "No" button
  button.style.width = '150px';
  button.style.height = '50px';

  // Add event listener for mouse move
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Only move the button when the mouse is close
    if (
      mouseX > rect.left - 100 && mouseX < rect.right + 100 &&
      mouseY > rect.top - 100 && mouseY < rect.bottom + 100
    ) {
      const container = choices.getBoundingClientRect();
      const newX = Math.random() * (1300);
      const newY = Math.random() * (700);

      // Update button's position
      button.style.position = "absolute";
      button.style.left = `${newX}px`;
      button.style.top = `${newY}px`;
    }
  });
}

  
      button.addEventListener("click", () => {
        logMessage(`You chose: ${choice.text}`);
  
        if (choice.traits) {
          for (const [trait, value] of Object.entries(choice.traits)) {
            player.updateTrait(trait, value);
          }
        }
  
        if (choice.next === "finish") {
          player.finish = true;
          logMessage("The game has ended.");
        } else if (choice.next.startsWith("q")) {
          player.lastchoice = choice.number;
          onComplete(); // Proceed to the next question in the scene
        } else {
          player.currentChapter = choice.next;
          startChapter();
        }
        
      });
  
      choices.appendChild(button);
    });
  }
  

  function logMessage(message) {
    const entry = document.createElement("p");
    entry.textContent = message;
    log.appendChild(entry);
  }

  await startChapter();
});
