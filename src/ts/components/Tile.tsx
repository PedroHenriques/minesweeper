'use strict';
import * as React from 'react';
import * as Styles from '../styles';

export interface ITileProps {
  index: number,
  revealed: boolean,
  hasMine: boolean,
  hasFlag: boolean,
  numAdjacentMines: number,
  lastInRow: boolean,
  maxEdgeLength: number,
  onMouseUp: (tileIndex: number, releasedButtonCode: number,
    buttonsCode: number) => void,
}

export class Tile extends React.Component<ITileProps, {}> {
  /**
   * Searches Styles.tile.edgeLengthAdjustments for a relevant entry, given the
   * provided edge length.
   */
  private getStyleAdjustments(edgeLength: number): React.CSSProperties {
    let styles: React.CSSProperties = {};
    for (let i = 0; i < Styles.tile.edgeLengthAdjustments.length; i++) {
      if (edgeLength <= Styles.tile.edgeLengthAdjustments[i].edgeLength) {
        styles = Styles.tile.edgeLengthAdjustments[i].styles;
        break;
      }
    }

    return(styles);
  }

  render() {
    let style : React.CSSProperties = { ...Styles.tile.base };
    let content: string = '';
    const edgeLength: number = this.props.maxEdgeLength;

    if (this.props.revealed) {
      style = { ...style, ...Styles.tile.revealed };
      if (this.props.hasFlag) {
        if (this.props.hasMine) {
          style = { ...style, ...Styles.tile.flag };
        } else {
          style = { ...style, ...Styles.tile.incorrectFlag };
        }
      } else if (this.props.hasMine) {
        style = { ...style, ...Styles.tile.mine };
      } else if (this.props.numAdjacentMines > 0) {
        content = `${this.props.numAdjacentMines}`;
        style = {
          ...style,
          ...Styles.tile.adjacentMines[this.props.numAdjacentMines],
          ...this.getStyleAdjustments(edgeLength),
        };
      }
    } else if (this.props.hasFlag) {
      style = { ...style, ...Styles.tile.flag };
    }
    if (this.props.lastInRow) {
      style = { ...style, ...Styles.tile.lastInRow };
    }

    style = {
      ...style,
      width: `${edgeLength}px`,
      height: `${edgeLength}px`,
      lineHeight: `${edgeLength}px`,
    };

    return(
      <div
      id={`tile-${this.props.index}`}
      style={style}
      onMouseUp={
        (e) => this.props.onMouseUp(this.props.index, e.button, e.buttons)}
      onContextMenu={(e) => e.preventDefault()}
      >
        { content }
      </div>
    );
  }
}