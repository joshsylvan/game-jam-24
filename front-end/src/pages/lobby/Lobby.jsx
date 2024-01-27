import { PageTemplate } from "../../components/PageTempalte";
import { useGameContext } from "../../context/GameContext";

function Lobby() {
  const { isHost, startGame, id } = useGameContext();

  const onGameStartClick = () => {
    if (!isHost) return;
    startGame(id);
  };

  return (
    <PageTemplate>
      <h1>Lobby</h1>
      <p>Please wait till game begins...</p>
      {isHost && <button onClick={() => onGameStartClick()}>Start Game</button>}
    </PageTemplate>
  );
}

export default Lobby;
