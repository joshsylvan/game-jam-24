import { PageTemplate } from "../../components/PageTempalte";
import { useGameContext } from "../../context/GameContext";

export const Results = () => {
  const { gameScript, voterMap } = useGameContext();

  return (
    <>
      <h1>The results are in!</h1>
      <h2>
        The HUMAN was <span>{gameScript.humanCharacter}</span>
      </h2>
      <ul>
        {Object.entries(voterMap ?? {}).map(([name, voters]) => {
          return (
            <li key={`char-name-${name}`}>
              <span>{name}:&nbsp;</span>
              <span>{voters.length}</span>
            </li>
          );
        })}
      </ul>
      {}
    </>
  );
};
