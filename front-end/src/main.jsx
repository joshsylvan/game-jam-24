import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/home/Home";
import Lobby from "./pages/lobby/Lobby";
import GameHost from "./pages/game-host/GameHost";
import GameWatcher from "./pages/game-watcher/GameWatcher";
import GameWriter from "./pages/game-writer/GameWriter";
import DevScreen from "./pages/dev/DevScreen";


import "./App.css";
import "./index.css";

const router = new createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/host",
    element: <GameHost />,
  },
  {
    path: "/lobby",
    element: <Lobby />,
  },
  {
    path: "/watcher",
    element: <GameWatcher />,
  },
  {
    path: "/writer",
    element: <GameWriter />,
  },
  {
    path: "/dev",
    element: <DevScreen />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
