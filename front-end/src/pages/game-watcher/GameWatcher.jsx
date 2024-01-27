import { useNavigate } from "react-router";
import { PageTemplate } from "../../components/PageTempalte";
import { GAME_STATE, useGameContext } from "../../context/GameContext";

function GameWatcher() {
  const { gameState, isHost } = useGameContext();
  const navigate = useNavigate();
  if (gameState === GAME_STATE.MOVE_TO_PLAY_STATE) {
    if (isHost) {
      navigate("/host");
    }
    return (
      <PageTemplate>
        <h1>Who is the human?</h1>
        {/* List the options to vote */}
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <h1>Waiting for the writer to complete their masterpeice</h1>
    </PageTemplate>
  );
}

export default GameWatcher;
