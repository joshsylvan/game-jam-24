import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const Context = createContext({});

export const GameContext = ({ children }) => {
  const [socket, setSocket] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [writerId, setWriterId] = useState("");

  const [isHost, setIsHost] = useState(false);

  const onConnection = () => {
    setIsConnected(true);
    socket.emit("join-game", { name });
  };

  const onNewHost = (newHostId) => {
    setId((currentId) => {
      if (newHostId && currentId === newHostId) {
        setIsHost(true);
      }
      return currentId;
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => onConnection());

    socket.on("joined-game", ({ id, isHost }) => {
      setId(id);
      setIsHost(isHost);
      console.log("isHost", isHost);
    });

    socket.on("new-host", ({ id }) => {
      console.log("new host id", id);
      onNewHost(id);
    });

    socket.on("game-started", ({ writerId }) => {
      onGameStarted(writerId);
    });
  }, [socket]);

  const connect = (name) => {
    console.log(name);
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

  return (
    <Context.Provider
      value={{ connect, startGame, isConnected, name, id, isHost, writerId }}
    >
      {children}
    </Context.Provider>
  );
};

export const useGameContext = () => useContext(Context);

GameContext.propTypes = {
  children: React.Component,
};
