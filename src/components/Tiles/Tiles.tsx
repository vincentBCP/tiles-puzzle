import { isEmpty } from "lodash";
import useGameStore from "../../store/game";
import Tile from "./Tile/Tile";
import clsx from "clsx";

const Tiles = () => {
  const { tiles, finished } = useGameStore();

  if (isEmpty(tiles)) return null;

  return (
    <div
      className={clsx(
        "grid grid-cols-4 gap-[4px] w-[500px] absolute top-[50%] left-[50%]",
        {
          "duration-300 !gap-0": finished,
        }
      )}
      style={{
        transform: "translate(-50%, -50%)",
      }}
    >
      {tiles.map((tile) => (
        <Tile key={tile.id} {...tile} />
      ))}
    </div>
  );
};

export default Tiles;
