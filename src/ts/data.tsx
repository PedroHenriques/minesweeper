import { IDifficulty } from './Interfaces';

/**
 * Minimum percentage of the minefield tiles that need to be revealed at the
 * start of the game.
 */
export const initialPatchMinSize: number = 0.06;

/**
 * Data for each of the valid minefield configurations.
 */
export const difficulties: IDifficulty[] = [
  { name: 'Beginner', rows: 9, cols: 9, mines: 10 },
  { name: 'Intermediate', rows: 16, cols: 16, mines: 40 },
  { name: 'Expert', rows: 16, cols: 30, mines: 99 },
];