'use strict';
import { CSSProperties } from 'react';
import * as General from './General';
import * as Mixins from './Mixins';

export function calcMenuHeight(styles: CSSProperties): number {
  return(
    Math.floor(
      parseFloat(<string>styles.fontSize) *
      parseFloat(<string>styles.lineHeight)
    ) + parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom) +
    parseFloat(styles.border) * 2
  );
}