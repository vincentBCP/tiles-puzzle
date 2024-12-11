import { useEffect } from "react";
import Tiles from "./components/Tiles";
import useGameStore from "./store/game";

const App = () => {
  const { init } = useGameStore();

  useEffect(() => {
    init();
  }, []);

  return <Tiles />;
};

export default App;
