'use strict';
import { CSSProperties } from 'react';

export function boxSizing(value: string): CSSProperties {
  return({
    boxSizing: value,
    WebkitBoxSizing: value,
    MozBoxSizing: value,
  });
}

export function userSelect(value: string): CSSProperties {
  return({
    userSelect: value,
    WebkitUserSelect: value,
    MozUserSelect: value,
    MSUserSelect: value,
  });
}

export function scale(...values: number[]): CSSProperties {
  return({
    transform: `scale(${values.join(',')})`,
    WebkitTransform: `scale(${values.join(',')})`,
    MSTransform: `scale(${values.join(',')})`,
    OTransform: `scale(${values.join(',')})`,
  });
}