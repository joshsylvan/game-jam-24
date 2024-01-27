import { useEffect } from "react";
import { PageTemplate } from "../../components/PageTempalte";
import { useGameContext } from "../../context/GameContext";
import { useNavigate } from "react-router";

function Lobby() {
  const { isHost, startGame, id, writerId } = useGameContext();
  const navigate = useNavigate();

  const onGameStartClick = () => {
    if (!isHost) return;
    startGame(id);
  };

  useEffect(() => {
    if (!writerId) return;

    if (writerId === id) {
      // Redirect user to the writer PAGE
      navigate("/writer");
    } else {
      // Redirect user to watcher UI
      navigate("/watcher");
    }
  }, [writerId, id]);

  return (
    <PageTemplate>
      <h1>Lobby</h1>
      <p>Please wait till game begins...</p>
      {isHost && <button onClick={() => onGameStartClick()}>Start Game</button>}
    </PageTemplate>
  );
}

export default Lobby;
