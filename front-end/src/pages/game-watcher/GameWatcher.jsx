import { useNavigate } from "react-router";
import { PageTemplate } from "../../components/PageTempalte";
import { GAME_STATE, useGameContext } from "../../context/GameContext";
import { useEffect, useState } from "react";
// import { testScript } from "../game-writer/testScript";
import { Button } from "../../components/Button";
import "./GameWatcher.css";

function GameWatcher() {
  const { gameState, gameScript, sendVote, name, isHost, hasVoted } =
    useGameContext();
  // const gameScript = testScript;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onVoteClick = (vote) => {
    console.log("I vote for ", vote);
    sendVote(name, vote);
    setIsLoading(true);
  };

  if (gameState === GAME_STATE.MOVE_TO_PLAY_STATE) {
    if (isHost) {
      navigate("/host");
    }

    return <h1>Watch the show and try to find out who the human is.</h1>;
  }

  if (gameState === GAME_STATE.VOTING) {
    return (
      <>
        <h1>Who is the human?</h1>
        {hasVoted ? (
          <p>Waiting for voting to finish</p>
        ) : (
          <div className="button-container">
            {gameScript?.characters.map((char, index) => (
              <Button
                className="voting-button"
                hueRotation={index * 45}
                key={`vote-for-${char.name}`}
                onClick={() => onVoteClick(char.name)}
              >
                <div className="inner-container">
                  {char.image_url && (
                    <img
                      style={{ filter: `hue-rotate(${index * -45}deg)` }}
                      className="button-image"
                      src={char.image_url}
                    />
                  )}
                  <p className="button-name">{char.name}</p>
                </div>
              </Button>
            ))}
          </div>
        )}
      </>
    );
  }

  if (gameState === GAME_STATE.RESULTS) {
    navigate("/results");
  }

  return (
    <PageTemplate>
      <h1>Waiting for the writer to complete their masterpeice</h1>
    </PageTemplate>
  );
}

export default GameWatcher;
