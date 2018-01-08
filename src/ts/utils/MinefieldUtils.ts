'use strict';
import { IDimensions, ITileConfig, IMinefieldData } from '../Interfaces';
import * as Data from '../data';
import * as Generators from './MineGenerators';
import * as SeedRandom from 'seedrandom';

/**
 * Generates a new minefield. Returns the minefield and the number of tiles
 * already revealed.
 */
export function generateMinefield(
  gameSeed: string,
  dimensions: IDimensions,
  numMines: number
): IMinefieldData {
  const prng = SeedRandom(gameSeed);

  let minefield: ITileConfig[];
  let revealTiles: number[] | null;
  do {
    minefield = [];
    for (let i = 0; i < dimensions.rows * dimensions.cols; i++) {
      minefield.push({
        revealed: false,
        hasMine: false,
        hasFlag: false,
        numAdjacentMines: 0,
      });
    }

    const offsets: number[][] = [
      [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ];
    const mines = Generators.pureRNG(dimensions, numMines, prng);
    mines.forEach(mineTileIndex => {
      minefield[mineTileIndex].hasMine = true;
      const adjacentTiles = findTileIndexes(dimensions, mineTileIndex, offsets);
      adjacentTiles.forEach(tileIndex => {
        minefield[tileIndex].numAdjacentMines++;
      });
    });

    revealTiles = chooseInitialPatch(dimensions, minefield, prng);
  } while (revealTiles === null);

  revealTiles.forEach(index => {
    minefield[index].revealed = true;
  });

  return({ minefield: minefield, numRevealed: revealTiles.length });
}

/**
 * Finds all the relevant tile indexes, by applying the offsets to the index
 * of focus. Will only return valid tile indexes.
 */
export function findTileIndexes(
  dimensions: IDimensions,
  focusIndex: number,
  offsets: number[][]
): number[] {
  const indexes: number[] = [];

  const rowIndex: number = Math.floor(focusIndex / dimensions.cols);
  const colIndex: number = focusIndex - rowIndex * dimensions.cols;
  offsets.forEach(offset => {
    const [rowOffset, colOffset] = offset;
    if (
      rowIndex + rowOffset < 0 || colIndex + colOffset < 0 ||
      rowIndex + rowOffset >= dimensions.rows ||
      colIndex + colOffset >= dimensions.cols
    ) {
      return;
    }

    indexes.push(
      colIndex + colOffset + (rowIndex + rowOffset) * dimensions.cols
    );
  });

  return(indexes);
}

/**
 * Determines the tiles that should be revealed based on 1 tile becoming
 * revealed. Only returns valid and not revealed tile indexes.
 */
export function calcTilesToReveal(
  minefield: ITileConfig[],
  tileIndex: number,
  dimensions: IDimensions
): number[] {
  if (!isTileEmpty(minefield[tileIndex])) {
    return([tileIndex]);
  }

  const offsets: number[][] = [
    [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
  ];
  const tilesToReveal: number[] = [];
  const queue: number[] = [tileIndex,
    ...findTileIndexes(dimensions, tileIndex, offsets)];
  do {
    const index = queue.pop();
    if (index === undefined || tilesToReveal.includes(index)) {
      continue;
    }
    if (!minefield[index].revealed) {
      tilesToReveal.push(index);
    }
    if (isTileEmpty(minefield[index])) {
      queue.push(...findTileIndexes(dimensions, index, offsets));
    }
  } while (queue.length > 0);

  return(tilesToReveal);
}

/**
 * Selects one of the empty patches of tiles or returns null if there are no
 * empty patches.
 */
function chooseInitialPatch(
  dimensions: IDimensions,
  minefield: ITileConfig[],
  prng: SeedRandom.prng
): number[] | null {
  const numberTiles: number = dimensions.rows * dimensions.cols;

  const queue: number[] = [];
  minefield.forEach((tile, index) => {
    if (isTileEmpty(tile)) {
      queue.push(index);
    }
  });

  const emptyPatches: number[][] = [];
  const checkedTiles: number[] = [];
  while (queue.length > 0) {
    const index = queue.pop();
    if (index === undefined || checkedTiles.includes(index)) {
      continue;
    }
    const patch = calcTilesToReveal(minefield, index, dimensions);
    checkedTiles.push(...patch);
    if (patch.length >= Math.round(Data.initialPatchMinSize * numberTiles)) {
      emptyPatches.push(patch);
    }
  }

  if (emptyPatches.length === 0) {
    return(null);
  } else {
    return(emptyPatches[Math.floor(prng() * emptyPatches.length)]);
  }
}

function isTileEmpty(tile: ITileConfig): boolean {
  return(!tile.hasMine && tile.numAdjacentMines === 0);
}