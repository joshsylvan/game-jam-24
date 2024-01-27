import { useState } from "react";
import { PageTemplate } from "../../components/PageTempalte";
import { CHARACTERS, CHARACTER_MAP } from "../../consts/characters";
import "./GameWriter.css";

const createScript = async (settingPrompt, actorMap) => {
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
    console.log(json);
  } catch (error) {
    console.error(error);
  }
};

function GameWriter() {
  const [actors, setActors] = useState({});
  const [prompt, setPrompt] = useState("");
  const onStartWritingClick = () => {
    createScript(prompt, actors);
  };
  const onActorChange = ({ target: { checked, id } }) => {
    setActors((old) => {
      old[id] = checked;
      return old;
    });
  };

  return (
    <>
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
      <button onClick={() => onStartWritingClick()}>Start Writing</button>
    </>
  );
}

export default GameWriter;
