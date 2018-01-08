'use strict';
import * as React from 'react';
import * as Styles from '../styles';
import { IGameConfig, IHtmlDimensions } from '../Interfaces';
import { Header } from './Header';
import { Minefield } from './Minefield';
import { Notification } from './Notification';

export interface IGameProps {
  viewport: IHtmlDimensions,
  gameConfig: IGameConfig,
}

export interface IGameState {
  minesLeft: number,
  livesLeft: number,
  gameEnded: boolean,
}

export class Game extends React.Component<IGameProps, IGameState> {
  private numValidTilesRevealed: number = 0;

  constructor(props: IGameProps) {
    super(props);
    this.state = {
      minesLeft: this.props.gameConfig.numMines,
      livesLeft: this.props.gameConfig.numLives,
      gameEnded: false,
    };

    this.handleValidTilesRevealed = this.handleValidTilesRevealed.bind(this);
    this.handleFlagsChanged = this.handleFlagsChanged.bind(this);
    this.handleExplosion = this.handleExplosion.bind(this);
  }

  /**
   * Handles checking if the game has ended by having all valid tiles revealed.
   */
  public handleValidTilesRevealed(numTiles: number): void {
    this.numValidTilesRevealed += numTiles;

    if (
      this.numValidTilesRevealed === this.props.gameConfig.dimensions.rows *
      this.props.gameConfig.dimensions.cols - this.props.gameConfig.numMines
    ) {
      this.setState({ gameEnded: true });
    }
  }

  /**
   * Handles updating the number of non flagged mines.
   */
  public handleFlagsChanged(deltaFlags: number): void {
    this.setState(prevState => {
      return({ minesLeft: prevState.minesLeft - deltaFlags });
    });
  }

  /**
   * Handles a tile with a mine being revealed.
   */
  public handleExplosion(): void {
    const livesLeft: number = this.state.livesLeft - 1;
    if (livesLeft === 0) {
      this.setState({
        livesLeft: livesLeft,
        gameEnded: true,
      });
      return;
    }

    this.setState({ livesLeft: livesLeft });
  }

  /**
   * Returns any notifications to be displayed.
   */
  private getNotification(): string {
    if (this.state.livesLeft > 0) {
      return('Congratulations!');
    } else {
      return('Game Over!');
    }
  }

  render() {
    return(
      <div id='game' style={Styles.game}>
        {
          this.state.gameEnded ?
          <Notification id='game-notifs' notifText={this.getNotification()}/> :
          ''
        }
        <Header
          minesLeft={this.state.minesLeft}
          lives={this.state.livesLeft}
          gameEnded={this.state.gameEnded}
        />
        <Minefield
          viewport={this.props.viewport}
          gameSeed={this.props.gameConfig.gameSeed}
          dimensions={this.props.gameConfig.dimensions}
          numMines={this.props.gameConfig.numMines}
          flagsEnabled={this.props.gameConfig.flagsEnabled}
          gameEnded={this.state.gameEnded}
          onValidTilesRevealed={this.handleValidTilesRevealed}
          onFlagsChanged={this.handleFlagsChanged}
          onExplosion={this.handleExplosion}
        />
      </div>
    );
  }
}