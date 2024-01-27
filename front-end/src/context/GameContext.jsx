import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const Context = createContext({});

export const GAME_STATE = {
  NONE: 1,
  MOVE_TO_PLAY_STATE: 2,
};

export const GameContext = ({ children }) => {
  const [socket, setSocket] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [writerId, setWriterId] = useState("");
  const [gameScript, setGameScript] = useState(null);
  const [gameState, setGameState] = useState(GAME_STATE.NONE);
  const [players, setPlayers] = useState([]);

  const [isHost, setIsHost] = useState(false);

  // Called and joins the game sessions
  const onConnection = () => {
    setIsConnected(true);
    socket.emit("join-game", { name });
  };
  // NOT NEEDED
  // Called when a new host is assinged
  // const onNewHost = (newHostId) => {
  //   setId((currentId) => {
  //     if (newHostId && currentId === newHostId) {
  //       setIsHost(true);
  //     }
  //     return currentId;
  //   });
  // };

  useEffect(() => {
    if (!socket) return;
    // WHen joining the socket try to join the game
    socket.on("connect", () => onConnection());
    // Once joined set the players ID
    socket.on("joined-game", ({ id, isHost: newIsHost }) => {
      setId(id);
      setIsHost(newIsHost);
    });
    // Handles when host is reassigned
    // socket.on("new-host", ({ id }) => {
    //   console.log("new host id", id);
    //   onNewHost(id);
    // });
    // Emitted when start-game has ran successfulee and assignes the writers ID
    socket.on("game-started", ({ writerId }) => {
      onGameStarted(writerId);
    });
    // Game is ready to begin playing the script
    socket.on("begin-game", ({ script }) => {
      setGameScript(script);
      setGameState(GAME_STATE.MOVE_TO_PLAY_STATE);
    });

    socket.on("update-players", ({ players }) => {
      setPlayers(players);
    });
  }, [socket]);

  const createHost = () => {
    connect("__host__");
  };

  // Connect to the web socket
  const connect = (name) => {
    const socket = io("localhost:4000");
    setName(name);
    setSocket(socket);
  };

  const startGame = (userId) => {
    socket.emit("start-game", { userId });
  };

  const onGameStarted = (writerId) => {
    setWriterId(writerId);
    console.log("LETS G{OOOO");
  };

  const sendScript = (script) => {
    socket.emit("submit-script", { script });
  };

  return (
    <Context.Provider
      value={{
        connect,
        startGame,
        isConnected,
        sendScript,
        name,
        id,
        isHost,
        writerId,
        gameState,
        createHost,
        players,
        gameScript,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useGameContext = () => useContext(Context);

GameContext.propTypes = {
  children: React.Component,
};
