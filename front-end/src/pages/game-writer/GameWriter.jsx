import { PageTemplate } from "../../components/PageTempalte";
import { CHARACTERS } from "../../consts/characters";
import "./GameWriter.css";

function GameWriter() {
  return (
    <PageTemplate>
      <input
        className="prompt-input"
        type="text"
        placeholder="Enter a setting for the scene..."
      />
      <h2>Please select 3 characters</h2>
      <div className="char-selection">
        {CHARACTERS.map(({ name, personality }) => (
          <label className="char-input" key={`char-${name}`} htmlFor={name}>
            <input id={name} name="characters" type="checkbox" />
            <div>
              <h2>{name}</h2>
              <p>{personality}</p>
            </div>
          </label>
        ))}
      </div>
      <button>Start Writing</button>
    </PageTemplate>
  );
}

export default GameWriter;
