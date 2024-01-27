import { PageTemplate } from "../../components/PageTempalte";
import { useGameContext } from "../../context/GameContext";

function GameHost() {
  const { gameScript } = useGameContext();

  return (
    <PageTemplate>
      <h1>Game Host</h1>
    </PageTemplate>
  );
}

export default GameHost;
