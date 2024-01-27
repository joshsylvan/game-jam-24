import { useState } from "react";
import { useEffect } from "react";
import { useGameContext } from "../../context/GameContext";
import { useNavigate } from "react-router";
import { PageTemplate } from "../../components/PageTempalte";
import song from "../../assets/turing_rock_show.mp3"

let audioPlaying = false
function onMouseDown() {
  if(!audioPlaying) {
    audioPlaying = true
    let audio = new Audio(song)
    audio.loop = true
    audio.play().catch(err => audioPlaying = false);
  }
}

function Home() {
  const [_name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { connect, isConnected, name, id } = useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);

    return () => {
      //Stop
      window.removeEventListener('mousedown', onMouseDown);
    }

  }, []);

  const onJoin = () => {
    console.log("connecting to game server...");
    setIsLoading(true);
    connect(_name);
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
      <h1>The Turing Show</h1>
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
        </>
      )}
    </PageTemplate>
  );
}

export default Home;
