document.getElementById("start-button").addEventListener("click", () => {
  document.getElementById("title-page").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
});

document.addEventListener("DOMContentLoaded", async () => {
  const log = document.getElementById("log");
  const question = document.getElementById("question");
  const choices = document.querySelector(".choices");

  // Player class for managing traits and game state
  class Player {
    constructor() {
      this.traits = { bravery: 0, kindness: 0 }; // Example player traits
      this.currentChapter = "chapter1"; // Starting chapter
      this.finish = false; // Game finish state
    }

    // Update a specific trait
    updateTrait(trait, value) {
      this.traits[trait] = (this.traits[trait] || 0) + value;
    }
  }

  const player = new Player();

  // Fetch a chapter's data
  async function loadChapter(chapterId) {
    try {
      const response = await fetch(`.json/${chapterId}.json`);
      if (!response.ok) throw new Error(`Failed to load ${chapterId}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Display a question with choices
  function displayQuestion(chapter) {
    question.textContent = chapter.question;
    choices.innerHTML = ""; // Clear old choices

    chapter.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.textContent = choice.text;
      button.addEventListener("click", () => {
        logMessage(`You chose: ${choice.text}`);

        // Update player traits based on choice
        if (choice.traits) {
          for (const [trait, value] of Object.entries(choice.traits)) {
            player.updateTrait(trait, value);
          }
        }

        // Check for game finish or move to next chapter
        if (choice.next === "finish") {
          player.finish = true;
          logMessage("The game has ended.");
        } else {
          player.currentChapter = choice.next;
          startChapter();
        }
      });
      choices.appendChild(button);
    });
  }

  // Log messages to the screen
  function logMessage(message) {
    const entry = document.createElement("p");
    entry.textContent = message;
    log.appendChild(entry);
  }

  // Load and start a chapter
  async function startChapter() {
    if (player.finish) return; // Stop if the game is finished

    const chapter = await loadChapter(player.currentChapter);
    if (!chapter) {
      logMessage("Error loading chapter. Game ending.");
      player.finish = true;
      return;
    }

    displayQuestion(chapter);
  }

  // Start the game at chapter 1
  await startChapter();
});
