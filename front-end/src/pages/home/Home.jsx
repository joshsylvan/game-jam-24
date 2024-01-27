import { useState } from "react";
import { useEffect } from "react";
import { useGameContext } from "../../context/GameContext";
import { useNavigate } from "react-router";
import { PageTemplate } from "../../components/PageTempalte";

function Home() {
  const [_name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { connect, isConnected, name, id, createHost } = useGameContext();
  const navigate = useNavigate();

  const onJoin = () => {
    console.log("connecting to game server...");
    setIsLoading(true);
    connect(_name);
  };

  const onHostClick = () => {
    createHost(() => {
      navigate("/host");
    });
  };

  useEffect(() => {
    if (isConnected) {
      setIsLoading(false);
      // Redirect to the lobby
    }
  }, [isConnected]);

  useEffect(() => {
    if (id && name) {
      console.log("NAVIGATE");
      navigate("/lobby");
    }
  }, [_name, id, name, navigate]);

  return (
    <PageTemplate>
      <h1>The Reverse Turing show</h1>
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <input
            type="text"
            value={_name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Please enter your name"
          />
          <button onClick={onJoin}>Join Game</button>
          <button onClick={onHostClick}>Host Game</button>
        </>
      )}
    </PageTemplate>
  );
}

export default Home;
