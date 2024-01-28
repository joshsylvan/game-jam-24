import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/home/Home";
import Lobby from "./pages/lobby/Lobby";
import GameHost from "./pages/game-host/GameHost";
import GameWatcher from "./pages/game-watcher/GameWatcher";
import GameWriter from "./pages/game-writer/GameWriter";

import "./App.css";
import "./index.css";
import { GameContext } from "./context/GameContext";
import { Results } from "./pages/results/Results";

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
    path: "results",
    element: <Results />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <GameContext>
    <RouterProvider router={router} />
  </GameContext>
);
