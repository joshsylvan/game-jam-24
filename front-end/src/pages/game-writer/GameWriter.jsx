import { useState } from "react";
import { PageTemplate } from "../../components/PageTempalte";
import { CHARACTERS, CHARACTER_MAP } from "../../consts/characters";
import { Button } from "../../components/button";
import { Loader } from "../../components/Loader";
import { testScript } from "./testScript";
import "./GameWriter.css";
import { GAME_STATE, useGameContext } from "../../context/GameContext";
import { useNavigate } from "react-router";

const getDialogElements = (script) => {
  const dialogElements = [];
  const indexSet = new Set();
  const scriptLength = script.dialogue.length;
  for (let i = 0; i < scriptLength; i += 1) {
    const el = script.dialogue[i];
    el.index = i;

    const isPlayer = el.isAI !== undefined && !el.isAI;
    if (!isPlayer) {
      continue;
    }

    if (isPlayer && !indexSet.has(i)) {
      // Handle previous
      const previousIndex = i - 1;
      const isPreviousIndexValid =
        previousIndex >= 0 && previousIndex < scriptLength;
      if (isPreviousIndexValid && !indexSet.has(previousIndex)) {
        indexSet.add(previousIndex);
        dialogElements.push(script.dialogue[previousIndex]);
      }
      // Handle current line
      if (!indexSet.has(i)) {
        dialogElements.push(el);
      }
      // Handle nex index
      const nextIndex = i + 1;
      const isNextIndexValid = nextIndex > 0 && nextIndex < scriptLength;
      if (isNextIndexValid && !indexSet.has(nextIndex)) {
        indexSet.add(nextIndex);
        dialogElements.push(script.dialogue[nextIndex]);
      }

      const nextNextIndex = i + 2;
      const isValidNextNext = nextNextIndex > 0 && nextNextIndex < scriptLength;
      // const isNNPlayer = el.isAI !== undefined && !el.isAI;
      if (isValidNextNext) {
        const nnElement = script.dialogue[nextNextIndex];
        if (!(nnElement.isAI !== undefined && !nnElement.isAI)) {
          dialogElements.push(null);
        }
      }
    }
  }
  return dialogElements;
};

const createScript = async (settingPrompt, actorMap) => {
  // return Promise.resolve(testScript);
  const characters = Object.entries(actorMap).reduce(
    (acc, [actor, include]) => {
      if (!include) {
        return acc;
      }
      acc.push(CHARACTER_MAP[actor]);
      return acc;
    },
    []
  );

  try {
    const response = await fetch("http://localhost:3000/sitcom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        settingPrompt,
        characters,
      }),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

function GameWriter() {
  const [actors, setActors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [script, setScript] = useState(null);
  const { sendScript, gameState } = useGameContext();
  const navigate = useNavigate();

  const onStartWritingClick = async () => {
    setIsLoading(true);
    setScript(await createScript(prompt, actors));
  };
  const onActorChange = ({ target: { checked, id } }) => {
    setActors((old) => {
      old[id] = checked;
      return old;
    });
  };

  const onSubmitClick = () => {
    const newScriptDialogue = [...script.dialogue];
    let inputs = document.querySelectorAll('input[id="script-input"]');
    inputs.forEach((element) => {
      const scriptIndex = parseInt(element.getAttribute("data-script-index"));
      console.log(element.value);
      newScriptDialogue[scriptIndex].speech = element.value;
    });
    console.log(inputs);
    const newScript = { ...script, dialogue: newScriptDialogue };
    setScript(newScript);
    sendScript(newScript);
  };

  if (
    gameState === GAME_STATE.MOVE_TO_PLAY_STATE ||
    gameState === GAME_STATE.VOTING
  ) {
    return <h1>Sit back and enjoy the show...</h1>;
  }

  if (gameState === GAME_STATE.RESULTS) {
    navigate("/results");
  }

  if (script) {
    return (
      <PageTemplate>
        {getDialogElements(script).map((d, index) => {
          if (!d) {
            return <div className="line" key={`break-${index}`} />;
          }
          let speechElement = d.speech;
          if (d.isAI !== undefined && !d.isAI) {
            speechElement = (
              <input
                id={`script-input`}
                data-script-index={d.index}
                type="text"
              />
            );
          }

          return (
            <div key={`dialog-${index}`}>
              <p className="char-name">
                <span>{d.name}: </span>
                {speechElement}
              </p>
            </div>
          );
        })}
        <button onClick={() => onSubmitClick()}>Submit Script</button>
      </PageTemplate>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <PageTemplate>
      <input
        className="prompt-input"
        type="text"
        placeholder="Enter a setting for the scene..."
        onChange={(e) => setPrompt(e.target.value)}
      />
      <h2>Please select 3 characters</h2>
      <div className="char-selection">
        {CHARACTERS.map(({ name, personality }) => (
          <label className="char-input" key={`char-${name}`} htmlFor={name}>
            <input
              onChange={(e) => onActorChange(e)}
              id={name}
              name="characters"
              type="checkbox"
            />
            <div>
              <h2>{name}</h2>
              <p>{personality}</p>
            </div>
          </label>
        ))}
      </div>
      <Button onClick={() => onStartWritingClick()}>Start Writing</Button>
    </PageTemplate>
  );
}

export default GameWriter;
