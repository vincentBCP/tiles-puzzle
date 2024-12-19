import { create } from "zustand";
import cryptoRandomString from "crypto-random-string";

const COLUMNS = 4;
const ROWS = 4;
const SIZE = 500;
const TILES_COUNT = COLUMNS * ROWS;
const TILE_SIZE = SIZE / COLUMNS;

export interface ITile {
  id: string;
  position: { x: number; y: number };
  location: number;
  index: number;
  void?: boolean;
}

const switchTiles = (tiles: ITile[], srcIndex: number, destIndex: number) => {
  const temp = { ...tiles[srcIndex] };
  tiles[srcIndex] = { ...tiles[destIndex] };
  tiles[destIndex] = temp;
};

const shuffle = (tiles: ITile[]) => {
  for (let i = 0; i < 200; i++) {
    const srcIndex = tiles.findIndex((t) => t.void);
    const direction = Math.floor(Math.random() * 4) || 4;

    let destIndex;

    switch (direction) {
      // top
      case 1:
        destIndex = srcIndex - COLUMNS;
        if (destIndex < 0) continue;
        break;
      // right
      case 2:
        destIndex = srcIndex + 1;
        if (Math.floor(destIndex / COLUMNS) !== Math.floor(srcIndex / COLUMNS))
          continue;
        break;
      // bottom
      case 3:
        destIndex = srcIndex + COLUMNS;
        if (destIndex >= TILES_COUNT - 1) continue;
        break;
      // left
      default:
        destIndex = srcIndex - 1;
        if (Math.floor(destIndex / COLUMNS) !== Math.floor(srcIndex / COLUMNS))
          continue;
    }

    switchTiles(tiles, srcIndex, destIndex);
  }

  return tiles;
};

const getTiles = () => {
  const tiles: ITile[] = [];

  const getLocation = (): number => {
    const locations: number[] = tiles.map((tile) => tile.location);
    const location =
      Math.floor(Math.random() * (TILES_COUNT - 1)) || TILES_COUNT - 1;

    return locations.includes(location) ? getLocation() : location;
  };

  const getPosition = (index: number) => {
    const row = index + 1;
    const horizontal = (index % COLUMNS) * TILE_SIZE;
    const vertical = (Math.ceil(row / COLUMNS) - 1) * TILE_SIZE;

    return { x: 0 - horizontal, y: 0 - vertical };
  };

  for (let index = 0; index < TILES_COUNT - 1; index++) {
    const location = getLocation();

    tiles.push({
      id: cryptoRandomString({ length: 10 }),
      position: getPosition(index),
      location,
      index,
    });
  }

  tiles.push({
    id: cryptoRandomString({ length: 10 }),
    location: TILES_COUNT,
    index: TILES_COUNT - 1,
    position: getPosition(TILES_COUNT - 1),
    void: true,
  });

  return shuffle(tiles);

  // const temp = { ...tiles[TILES_COUNT - 1] }; // 15
  // tiles[TILES_COUNT - 1] = { ...tiles[TILES_COUNT - 2] };
  // tiles[TILES_COUNT - 2] = temp;

  // return tiles;
};

const isGameFinised = (tiles: ITile[]) => {
  const str = Array(tiles.length)
    .fill(0)
    .map((v, index) => (v + index).toString())
    .join("");
  const str2 = tiles.map((tile) => tile.index.toString()).join("");

  return str === str2;
};

const useGameStore = create<{
  tiles: ITile[];
  moves: number;
  finished?: boolean;
  init: () => void;
  switchTiles: (srcLoc: number, destLoc: number) => void;
}>()((set, get) => ({
  tiles: [],
  moves: 0,
  finished: false,
  init: () => {
    set({ tiles: getTiles() });
  },
  switchTiles: (srcLoc: number, destLoc: number) => {
    const updatedTiles = [...get().tiles];
    const srcIndex = updatedTiles.findIndex((tile) => tile.location === srcLoc);
    const destIndex = updatedTiles.findIndex(
      (tile) => tile.location === destLoc
    );

    if (!updatedTiles[destIndex].void) return;

    const _switch = (direction: "left" | "right" | "top" | "bottom") => {
      const srcTileElem = document.getElementById(
        updatedTiles.find((tile) => tile.location === srcLoc)?.id || ""
      );
      const descTileElem = document.getElementById(
        updatedTiles.find((tile) => tile.location === destLoc)?.id || ""
      );

      if (!srcTileElem || !descTileElem) return;

      srcTileElem.style.transitionDuration = "300ms";
      descTileElem.style.transitionDuration = "300ms";
      const shiftValue = TILE_SIZE + 1;

      switch (direction) {
        case "left":
          {
            srcTileElem.style.transform = `translateX(-${shiftValue}px)`;
            descTileElem.style.transform = `translateX(${shiftValue}px)`;
          }
          break;
        case "right":
          {
            srcTileElem.style.transform = `translateX(${shiftValue}px)`;
            descTileElem.style.transform = `translateX(-${shiftValue}px)`;
          }
          break;
        case "top":
          {
            srcTileElem.style.transform = `translateY(-${shiftValue}px)`;
            descTileElem.style.transform = `translateY(${shiftValue}px)`;
          }
          break;
        default: {
          srcTileElem.style.transform = `translateY(${shiftValue}px)`;
          descTileElem.style.transform = `translateY(-${shiftValue}px)`;
        }
      }

      setTimeout(() => {
        srcTileElem.style.transitionDuration = "0s";
        descTileElem.style.transitionDuration = "0s";
        srcTileElem.style.transform = `translate(0,0)`;
        descTileElem.style.transform = `translate(0,0)`;

        switchTiles(updatedTiles, srcIndex, destIndex);

        const finished = isGameFinised(updatedTiles);

        if (finished) {
          updatedTiles[TILES_COUNT - 1].void = false;
        }

        set({ tiles: updatedTiles, moves: get().moves + 1, finished });
      }, 300);
    };

    if (destIndex === srcIndex - 1) {
      // left
      _switch("left");
    } else if (destIndex === srcIndex + 1) {
      // right
      _switch("right");
    } else if (destIndex === srcIndex - COLUMNS) {
      // top
      _switch("top");
    } else if (destIndex === srcIndex + COLUMNS) {
      // bottom
      _switch("bottom");
    }
  },
}));

export default useGameStore;
