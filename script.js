// Example game state
const gameData = {
    1: {
      text: "You enter a dark forest. Do you go left or right?",
      choices: { 1: "Go left", 2: "Go right" },
      next: { 1: 2, 2: 3 },
    },
    2: {
      text: "You find a treasure chest! Open it or leave it?",
      choices: { 1: "Open it", 2: "Leave it" },
      next: { 1: 4, 2: 5 },
    },
    3: {
      text: "You encounter a wild beast! Fight or run?",
      choices: { 1: "Fight", 2: "Run" },
      next: { 1: 6, 2: 7 },
    },
    // Add more story paths as needed...
  };
  
  let currentScene = 1;
  
  function makeChoice(choice) {
    const scene = gameData[currentScene];
    if (scene) {
      currentScene = scene.next[choice];
      updateStory();
    }
  }
  
  function updateStory() {
    const scene = gameData[currentScene];
    if (scene) {
      document.getElementById("story-text").innerText = scene.text;
      const choicesDiv = document.getElementById("choices");
      choicesDiv.innerHTML = "";
      Object.keys(scene.choices).forEach((key) => {
        const button = document.createElement("button");
        button.innerText = scene.choices[key];
        button.onclick = () => makeChoice(Number(key));
        choicesDiv.appendChild(button);
      });
    }
  }
  
  updateStory();
  