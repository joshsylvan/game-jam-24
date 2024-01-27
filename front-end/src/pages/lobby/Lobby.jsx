import { useEffect } from "react";
import { PageTemplate } from "../../components/PageTempalte";
import { useGameContext } from "../../context/GameContext";
import { useNavigate } from "react-router";

function Lobby() {
  const { isHost, startGame, id, writerId, players } = useGameContext();
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

  if (isHost) {
    return (
      <PageTemplate>
        <h1>Hosting</h1>
        <p>Please wait till game begins all your players have joined</p>
        <button onClick={() => onGameStartClick()}>Start Game</button>
        <ul>
          {players.map(({ name }, i) => (
            <li key={`name-${name}-${i}`}>{name}</li>
          ))}
        </ul>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <h1>Lobby</h1>
      <p>Please wait till game begins...</p>
      <p>{players.length} people have joined.</p>
    </PageTemplate>
  );
}

export default Lobby;
