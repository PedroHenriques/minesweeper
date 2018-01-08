'use strict';
import { CSSProperties } from 'react';
import * as Mixins from './Mixins';

export const baseFontSize: number = 20;

export const base: CSSProperties = {
  margin: '0',
  padding: '0',
  fontSize: `${baseFontSize}px`,
  fontFamily: 'roboto',
  ...Mixins.boxSizing('border-box'),
  ...Mixins.userSelect('none'),
};

export const buttonBase: CSSProperties = {
  cursor: 'pointer',
  display: 'inline-block',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  border: '1px solid transparent',
  paddingTop: `${0.375 * baseFontSize}px`,
  paddingBottom: `${0.375 * baseFontSize}px`,
  paddingLeft: `${0.75 * baseFontSize}px`,
  paddingRight: `${0.75 * baseFontSize}px`,
  fontSize: `${baseFontSize}px`,
  lineHeight: '1.5',
  borderRadius: `${0.25 * baseFontSize}px`,
  transition: `color .15s ease-in-out, background-color .15s ease-in-out,
    border-color .15s ease-in-out, box-shadow .15s ease-in-out`,
  color: 'rgb(255, 255, 255)',
  backgroundColor: 'rgb(0, 123, 255)',
  borderColor: 'rgb(0, 123, 255)',
};

export const buttonHoverBase: CSSProperties = {
  color: 'rgb(255, 255, 255)',
  backgroundColor: 'rgb(0, 105, 217)',
  borderColor: 'rgb(0, 98, 204)',
  textDecoration: 'none',
};

export const buttonActiveBase: CSSProperties = {
  color: 'rgb(255, 255, 255)',
  backgroundColor: 'rgb(0, 98, 204)',
  borderColor: 'rgb(0, 92, 191)',
  backgroundImage: 'none',
};

export const buttonFocusBase: CSSProperties = {
  boxShadow: `0 0 0 ${0.2 * baseFontSize}px rgba(0, 123, 255, 0.5)`,
  outline: '0',
  textDecoration: 'none',
};

export const bgImgBase: CSSProperties = {
  backgroundSize: '80%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
};

export const formElemBase: CSSProperties = {
  fontSize: `${0.75 * baseFontSize}px`,
  padding: `${0.1 * baseFontSize}px`,
  marginLeft: `${0.5 * baseFontSize}px`,
};

export const imageBase: CSSProperties = {
  border: '0',
};

export const headerBtnBase: CSSProperties = {
  position: 'relative',
  float: 'left',
  fontSize: `${0.75 * baseFontSize}px`,
};

export const headerImgBase: CSSProperties = {
  ...imageBase,
  height: '100%',
  width: 'auto',
  marginRight: `${0.5 * baseFontSize}px`,
};

export const headerDivBase: CSSProperties = {
  position: 'relative',
  float: 'left',
  width: '15%',
  height: '100%',
  minWidth: '120px',
};