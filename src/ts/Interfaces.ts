'use strict';
import { CSSProperties } from 'react';

export interface IDimensions {
  rows: number,
  cols: number,
}

export interface IGameConfig {
  numMines: number,
  dimensions: IDimensions,
  flagsEnabled: boolean,
  numLives: number,
  gameSeed: string,
}

export interface ITileConfig {
  revealed: boolean,
  hasMine: boolean,
  hasFlag: boolean,
  numAdjacentMines: number,
}

export interface IMinefieldData {
  minefield: ITileConfig[],
  numRevealed: number,
}

export interface IDifficulty {
  name: string,
  rows: number,
  cols: number,
  mines: number,
}

export interface IHtmlDimensions {
  width: number,
  height: number,
}

export interface IStylishButtonStyles {
  base: CSSProperties,
  ':active'?: CSSProperties,
  ':hover'?: CSSProperties,
  ':focus'?: CSSProperties,
}