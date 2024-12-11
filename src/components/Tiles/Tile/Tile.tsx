import useGameStore, { ITile } from "../../../store/game";

const Tile = ({ id, location, position, void: black }: Readonly<ITile>) => {
  const { switchTiles } = useGameStore();

  return (
    <div
      id={id}
      draggable={!black}
      onDragStart={(ev) => ev.dataTransfer.setData("text", location.toString())}
      onDragOver={(ev) => ev.preventDefault()}
      onDrop={(ev) => {
        ev.preventDefault();
        const srcLoc = Number(ev.dataTransfer.getData("text"));

        switchTiles(srcLoc, location);
      }}
      className="aspect-[1/1]"
      style={
        black
          ? { backgroundColor: "black" }
          : {
              backgroundImage: "url('./src/assets/_.jpeg')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "500px 500px",
              backgroundPosition: `${position.x}px ${position.y}px`,
            }
      }
    />
  );
};

export default Tile;
