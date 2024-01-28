import { useState } from "react";
import { useEffect } from "react";
import { useGameContext } from "../../context/GameContext";
import { useNavigate } from "react-router";
import { PageTemplate } from "../../components/PageTempalte";
import { Button } from "../../components/button";
import song from "../../assets/turing_rock_show.mp3";
import "./Home.css";

let audioPlaying = false;
let audio;
function onMouseDown() {
  if (!audioPlaying) {
    audioPlaying = true;
    audio = new Audio(song);
    audio.loop = true;
    audio.play().catch((err) => (audioPlaying = false));
  }
}

function Home() {
  const [_name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { connect, isConnected, name, id, createHost } = useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("mousedown", onMouseDown);

    return () => {
      //Stop
      window.removeEventListener("mousedown", onMouseDown);
      audio.pause();
    };
  }, []);

  const onJoin = () => {
    console.log("connecting to game server...");
    setIsLoading(true);
    connect(_name);
  };

  const onHostClick = () => {
    createHost();
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
      <div className="background-image" />

      {isLoading ? (
        "Loading..."
      ) : (
        <div className="user-input">
          <div className="user-box">
            <input
              className="name-input"
              type="text"
              value={_name}
              onChange={(event) => setName(event.target.value)}
            />
            <label>Enter your name</label>
          </div>
          <Button className="start-button" onClick={onJoin}>
            Join Game
          </Button>
          <Button
            className="start-button"
            onClick={onHostClick}
            hueRotation={90}
          >
            Host Game
          </Button>
        </div>
      )}
    </PageTemplate>
  );
}

export default Home;
