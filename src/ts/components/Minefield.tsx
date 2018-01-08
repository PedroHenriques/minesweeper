'use strict';
import * as React from 'react';
import * as Styles from '../styles';
import { Tile } from './Tile';
import {
  IDimensions, ITileConfig, IMinefieldData, IHtmlDimensions
} from '../Interfaces';
import * as Utils from '../utils/MinefieldUtils';

export interface IMinefieldProps {
  viewport: IHtmlDimensions,
  gameSeed: string,
  dimensions: IDimensions,
  numMines: number,
  flagsEnabled: boolean,
  gameEnded: boolean,
  onValidTilesRevealed: (numTiles: number) => void,
  onFlagsChanged: (deltaFlags: number) => void,
  onExplosion: () => void,
}

export interface IMinefieldState {
  minefield: ITileConfig[],
}

export class Minefield extends
React.Component<IMinefieldProps, IMinefieldState> {
  private timeoutId: NodeJS.Timer | null = null;

  constructor(props: IMinefieldProps) {
    super(props);

    let minefieldData: IMinefieldData;
    minefieldData = Utils.generateMinefield(
      this.props.gameSeed, this.props.dimensions, this.props.numMines
    );

    this.state = {
      minefield: minefieldData.minefield,
    };
    this.props.onValidTilesRevealed(minefieldData.numRevealed);

    this.onMouseUp = this.onMouseUp.bind(this);
    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleLeftRightClick = this.handleLeftRightClick.bind(this);
    this.computeHtmlDimensions = this.computeHtmlDimensions.bind(this);
    this.calcTileMaxEdgeLength = this.calcTileMaxEdgeLength.bind(this);
  }

  /**
   * Called when a mouse up event happens on a Tile.
   */
  public onMouseUp(
    tileIndex: number, releasedButtonCode: number, buttonsCode: number
  ): void {
    if (this.props.gameEnded) {
      return;
    }

    const timeoutDuration: number = 500;

    if (releasedButtonCode === 0 && buttonsCode === 0) {
      if (this.timeoutId === null) {
        this.handleLeftClick(tileIndex);
      } else {
        global.clearTimeout(this.timeoutId);
        this.timeoutId = null;
        if (this.state.minefield[tileIndex].revealed) {
          this.handleLeftRightClick(tileIndex);
        }
      }
      return;
    }
    if (releasedButtonCode === 0 && buttonsCode === 2) {
      this.timeoutId = global.setTimeout(this.handleLeftClick, timeoutDuration,
        tileIndex);
      return;
    }
    if (releasedButtonCode === 2 && buttonsCode === 0) {
      if (this.timeoutId === null) {
        this.handleRightClick(tileIndex);
      } else {
        global.clearTimeout(this.timeoutId);
        this.timeoutId = null;
        if (this.state.minefield[tileIndex].revealed) {
          this.handleLeftRightClick(tileIndex);
        }
      }
      return;
    }
    if (releasedButtonCode === 2 && buttonsCode === 1) {
      this.timeoutId = global.setTimeout(this.handleRightClick, timeoutDuration,
        tileIndex);
      return;
    }
  }

  /**
   * Handles a left mouse button click on a tile.
   */
  private handleLeftClick(tileIndex: number): void {
    if (
      this.state.minefield[tileIndex].revealed ||
      this.state.minefield[tileIndex].hasFlag
    ) {
      return;
    }

    const newMinefield = this.state.minefield;
    const tilesToReveal = Utils.calcTilesToReveal(
      newMinefield, tileIndex, this.props.dimensions
    );
    let numNonMineTilesRevealed: number = tilesToReveal.length;
    tilesToReveal.forEach(index => {
      newMinefield[index].revealed = true;
      if (newMinefield[index].hasMine) {
        numNonMineTilesRevealed--;
      }
    });

    this.setState({
      minefield: newMinefield,
    });

    if (newMinefield[tileIndex].hasMine) {
      this.props.onExplosion();
    }
    if (numNonMineTilesRevealed > 0) {
      this.props.onValidTilesRevealed(numNonMineTilesRevealed);
    }
  }

  /**
   * Handles a right mouse button click on a tile.
   */
  private handleRightClick(tileIndex: number): void {
    if (
      !this.props.flagsEnabled ||
      this.state.minefield[tileIndex].revealed
    ) {
      return;
    }

    const newMinefield = this.state.minefield;
    newMinefield[tileIndex].hasFlag = !newMinefield[tileIndex].hasFlag;
    this.setState({ minefield: newMinefield });
    this.props.onFlagsChanged((newMinefield[tileIndex].hasFlag ? 1 : -1));
  }

  /**
   * Handles a left + right mouse button click on a tile.
   */
  private handleLeftRightClick(tileIndex: number): void {
    const adjacentIndexes = Utils.findTileIndexes(
      this.props.dimensions, tileIndex,
      [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    );
    let numFlags: number = 0;
    adjacentIndexes.forEach(index => {
      if (this.state.minefield[index].hasFlag) {
        numFlags++;
      }
    });

    if (numFlags < this.state.minefield[tileIndex].numAdjacentMines) {
      return;
    }

    adjacentIndexes.forEach(index => {
      this.handleLeftClick(index);
    });
  }

  /**
   * Calculates the width and height of the div#minefield HTML element.
   */
  private computeHtmlDimensions(): IHtmlDimensions {
    const minViewportDimension: number = Math.min(this.props.viewport.width,
      this.props.viewport.height);
    const paddingPerSide: number = parseFloat(Styles.app.padding) / 100 *
      minViewportDimension;

    const appDimensions: IHtmlDimensions = {
      width: parseFloat(Styles.app.minWidth) - 2 * paddingPerSide,
      height: parseFloat(Styles.app.minHeight) - 2 * paddingPerSide,
    };

    const tempAppWidth: number = parseFloat(Styles.app.maxWidth) / 100 *
      this.props.viewport.width - 2 * paddingPerSide;
    if (tempAppWidth > appDimensions.width) {
      appDimensions.width = tempAppWidth;
    }

    const tempAppHeight: number = parseFloat(Styles.app.maxHeight) / 100 *
      this.props.viewport.height - 2 * paddingPerSide;
    if (tempAppHeight > appDimensions.height) {
      appDimensions.height = tempAppHeight;
    }

    const gameHeightReMatches: RegExpMatchArray = Styles.game.height
      .match(/^calc\((\d+)% - (\d+)px\)$/i);
    const gameDimensions: IHtmlDimensions = {
      width: appDimensions.width * parseFloat(Styles.game.width) / 100,
      height: appDimensions.height * parseFloat(gameHeightReMatches[1]) / 100 -
        parseFloat(gameHeightReMatches[2]),
    };

    const minefieldHeightReMatches: RegExpMatchArray = Styles.minefield.height
      .match(/^calc\((\d+)% - (\d+)px\)$/i);
    return({
      width: Math.floor(
        gameDimensions.width * parseFloat(Styles.minefield.width) / 100
      ),
      height: Math.floor(
        gameDimensions.height * parseFloat(minefieldHeightReMatches[1]) / 100 -
        parseFloat(minefieldHeightReMatches[2])
      ),
    });
  }

  /**
   * Calculates the maximum length for each Tile's edge (in px).
   */
  private calcTileMaxEdgeLength(): number {
    const minefieldDimensions = this.computeHtmlDimensions();
    return(Math.min(
      Math.floor(minefieldDimensions.width / this.props.dimensions.cols),
      Math.floor(minefieldDimensions.height / this.props.dimensions.rows)
    ));
  }

  componentWillUnmount() {
    if (this.timeoutId !== null) {
      global.clearTimeout(this.timeoutId);
    }
  }

  render() {
    const tileMaxEdgeLength = this.calcTileMaxEdgeLength();

    const tiles: JSX.Element[] = [];
    this.state.minefield.forEach((tileConfig, index) => {
      tiles.push(
        <Tile
        key={index}
        index={index}
        revealed={(this.props.gameEnded ? true : tileConfig.revealed)}
        hasMine={tileConfig.hasMine}
        hasFlag={tileConfig.hasFlag}
        numAdjacentMines={tileConfig.numAdjacentMines}
        lastInRow={(index + 1) % this.props.dimensions.cols === 1}
        maxEdgeLength={tileMaxEdgeLength}
        onMouseUp={this.onMouseUp}
        />
      );
    });

    return(
      <div id='minefield' style={Styles.minefield}>
        {tiles}
      </div>
    );
  }
}