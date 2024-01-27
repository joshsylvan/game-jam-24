function extractTitle(lines) {
  if(lines[0].startsWith("Title:")) return lines[0].split("Title:")[1].trim();
}

function extractNarrator(line) {
  if (line === "") return;
  if (line.startsWith("INT") || line.startsWith("EXT") || line.startsWith("FADE OUT")) return;
  return {
    name: "Narrator",
    voiceId: "cKx1nyNQBkX7cXitLRzo",
    speech: line
  }
}

function extractCharacterDialogue(lines, characters) {
  const dialogue = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const character = characters.find(character => line === character.name.toUpperCase());
    if(!character) {
      const narratorLine = extractNarrator(line)
      if (narratorLine) dialogue.push(narratorLine);
      continue;
    }
    const characterDialogue = structuredClone(character);
 
    const nextLine = lines[i+1];

    const hasDirection = nextLine.includes("(");
    if (hasDirection) {
      const direction = nextLine.split("(")[1].split(")")[0];
      characterDialogue.direction = direction;
      const speech = lines[i+2];
      characterDialogue.speech = speech;
      i = i + 2;
    }else{
      const speech = lines[i+1];
      characterDialogue.speech = speech;
      i = i + 1;
    }

    if(!character.isAI) {
      characterDialogue.speech = "...";
      characterDialogue.direction = undefined
    }

    dialogue.push(characterDialogue);
  }
  return dialogue;
}


function extractFirstScene(lines) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("INT") || lines[i].startsWith("EXT")) {
      const scene = lines[i].split(".")[1];
      return scene;
    }
  }
}

function selectRandomPlayerCharacter(characters) {
  const randomIndex = Math.floor(Math.random() * characters.length);
  characters[randomIndex].isAI = false;
}

function scriptParser(script, characters) {
  console.log("--- Parsing Script ---")
  const lines = script.split("\n");
  const parsedScript = {}
  
  selectRandomPlayerCharacter(characters);
  parsedScript.title = extractTitle(lines);
  parsedScript.scene = extractFirstScene(lines);
  parsedScript.dialogue = extractCharacterDialogue(lines, characters);

  return parsedScript;
}
module.exports = scriptParser;

