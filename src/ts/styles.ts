'use strict';
import { CSSProperties } from 'react';
import * as General from './styles/General';
import * as Mixins from './styles/Mixins';
import * as Functions from './styles/Functions';
import { IStylishButtonStyles } from './Interfaces';
import { baseFontSize } from './styles/General';

export const app: CSSProperties = {
  ...General.base,
  position: 'absolute',
  maxWidth: '100vw',
  maxHeight: '100vh',
  minWidth: '400px',
  minHeight: '400px',
  padding: '2vmin',
};

export const newGameButton: IStylishButtonStyles = {
  base: {
    ...General.base,
    ...General.buttonBase,
    ...General.headerBtnBase,
  },
  ':hover': {
    ...General.buttonHoverBase,
  },
  ':active': {
    ...General.buttonActiveBase,
  },
  ':focus': {
    ...General.buttonFocusBase,
  },
};

export const resetGameButton: IStylishButtonStyles = {
  base: {
    ...General.base,
    ...General.buttonBase,
    ...General.headerBtnBase,
    marginLeft: `${General.baseFontSize}px`,
  },
  ':hover': {
    ...General.buttonHoverBase,
  },
  ':active': {
    ...General.buttonActiveBase,
  },
  ':focus': {
    ...General.buttonFocusBase,
  },
};

export const githubLink: CSSProperties = {
  ...General.base,
  float: 'right',
};

const menuHeight: number = Functions.calcMenuHeight(newGameButton.base);
export const menu: CSSProperties = {
  ...General.base,
  position: 'relative',
  width: '100%',
  height: `${menuHeight}px`,
  overflow: 'auto',
};

export const setup: CSSProperties = {
  ...General.base,
  position: 'relative',
  width: '100%',
  height: '100%',
};

export const difficultySelect: CSSProperties = {
  ...General.base,
  ...General.formElemBase,
};

export const flagsEnabledCheckbox: CSSProperties = {
  ...Mixins.scale(1.5),
};

export const flagsEnabledLabel: CSSProperties = {
  ...General.base,
  marginLeft: `${0.5 * General.baseFontSize}px`,
};

export const numLivesInput: CSSProperties = {
  ...General.base,
  ...General.formElemBase,
  width: `${3 * General.baseFontSize}px`,
};

export const gameSeedInput: CSSProperties = {
  ...General.base,
  ...General.formElemBase,
};

export const gameSeedGenerate: CSSProperties = {
  ...General.base,
  marginLeft: `${0.5 * General.baseFontSize}px`,
  height: `${2.75 * General.baseFontSize}px`,
  cursor: 'pointer',
};

export const startGameButton: IStylishButtonStyles = {
  base: {
    ...General.base,
    ...General.buttonBase,
  },
  ':hover': {
    ...General.buttonHoverBase,
  },
  ':active': {
    ...General.buttonActiveBase,
  },
  ':focus': {
    ...General.buttonFocusBase,
  },
};

export const game: CSSProperties = {
  ...General.base,
  position: 'relative',
  width: '100%',
  height: `calc(100% - ${menuHeight}px)`,
  overflow: 'auto',
};

const headerHeight: number = 55;
export const header: CSSProperties = {
  ...General.base,
  position: 'relative',
  padding: `${0.5 * General.baseFontSize}px 0px`,
  width: '100%',
  height: `${headerHeight}px`,
  overflow: 'auto',
};

export const headerTimer: CSSProperties = {
  ...General.base,
  ...General.headerDivBase,
};

export const headerMines: CSSProperties = {
  ...General.base,
  ...General.headerDivBase,
};

export const headerLives: CSSProperties = {
  ...General.base,
  ...General.headerDivBase,
};

export const headerTimerImg: CSSProperties = {
  ...General.base,
  ...General.headerImgBase,
};

export const headerMinesImg: CSSProperties = {
  ...General.base,
  ...General.headerImgBase,
};

export const headerLivesImg: CSSProperties = {
  ...General.base,
  ...General.headerImgBase,
};

export const notification: CSSProperties = {
  ...General.base,
  position: 'absolute',
  marginTop: `${headerHeight}px`,
  width: '50%',
  left: '25%',
  top: '25%',
  padding: `${baseFontSize}px`,
  zIndex: 99,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  fontWeight: 'bold',
  fontSize: `${1.5 * General.baseFontSize}px`,
  textAlign: 'center',
};

export const notificationButton: IStylishButtonStyles = {
  base: {
    ...General.base,
    ...General.buttonBase,
  },
  ':hover': {
    ...General.buttonHoverBase,
  },
  ':active': {
    ...General.buttonActiveBase,
  },
  ':focus': {
    ...General.buttonFocusBase,
  },
};

export const minefield: CSSProperties = {
  ...General.base,
  position: 'relative',
  width: '100%',
  height: `calc(100% - ${headerHeight}px)`,
  overflow: 'auto',
};

export const tile: { [key: string]: CSSProperties } = {
  base: {
    ...General.base,
    float: 'left',
    border: `solid black ${0.05 * General.baseFontSize}px`,
    backgroundColor: 'grey',
    cursor: 'pointer',
    textShadow: `-${0.02 * General.baseFontSize}px
      -${0.02 * General.baseFontSize}px 0 #000,
      ${0.02 * General.baseFontSize}px -${0.02 * General.baseFontSize}px 0 #000,
      -${0.02 * General.baseFontSize}px ${0.02 * General.baseFontSize}px 0 #000,
      ${0.02 * General.baseFontSize}px ${0.02 * General.baseFontSize}px 0 #000`,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lastInRow: {
    clear: 'left',
  },
  revealed: {
    backgroundColor: 'white',
  },
  mine: {
    ...General.bgImgBase,
    backgroundImage: 'url(/img/mine.png)',
  },
  flag: {
    ...General.bgImgBase,
    backgroundImage: 'url(/img/flag.png)',
  },
  incorrectFlag: {
    ...General.bgImgBase,
    backgroundImage: 'url(/img/incorrect-flag.png)',
  },
  adjacentMines: {
    1: { color: 'rgb(0, 0, 0)' },
    2: { color: 'rgb(0, 0, 255)' },
    3: { color: 'rgb(0, 150, 255)' },
    4: { color: 'rgb(0, 255, 255)' },
    5: { color: 'rgb(255, 255, 150)' },
    6: { color: 'rgb(255, 255, 0)' },
    7: { color: 'rgb(255, 150, 0)' },
    8: { color: 'rgb(255, 0, 0)' },
  },
  edgeLengthAdjustments: [
    // ASC order of edgeLength
    { edgeLength: 15, styles: { fontSize: '10px' } },
    { edgeLength: 25, styles: { fontSize: '17px' } },
  ],
};