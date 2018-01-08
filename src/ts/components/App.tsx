'use strict';
import * as React from 'react';
import * as Styles from '../styles';
import { IGameConfig, IHtmlDimensions } from '../Interfaces';
import { Menu } from './App/Menu';
import { Setup } from './Setup';
import { Game } from './Game';

export interface IAppState {
  gameConfig: IGameConfig | null,
  viewport: IHtmlDimensions | null,
  gameId: string,
}

export class App extends React.Component<{}, IAppState> {
  private resizeTimeoutId: NodeJS.Timer | null = null;
  private windowFacade = {
    getViewportDimensions: (): IHtmlDimensions => {
        return({ width: window.innerWidth, height: window.innerHeight });
      },

    addEventListener: (type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions): void => {
        window.addEventListener(type, listener, options);
      },

    removeEventListener: (type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions): void => {
        window.removeEventListener(type, listener, options);
      },
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      gameConfig: null,
      viewport: null,
      gameId: `game-${Date.now()}`,
    };

    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleResetGame = this.handleResetGame.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.stopResizeHandling = this.stopResizeHandling.bind(this);
  }

  /**
   * Handles clicks on the "New Game" button.
   */
  public handleNewGame(): void {
    this.stopResizeHandling();
    this.setState({ gameConfig: null, viewport: null });
  }

  /**
   * Handles clicks on the "Reset Game" button.
   */
  public handleResetGame(): void {
    this.setState({ gameId: `game-${Date.now()}` });
  }

  /**
   * Handles clicks on the "Start Game" button.
   */
  public handleStart(config: IGameConfig): void {
    this.setState({
      gameConfig: config,
      viewport: this.windowFacade.getViewportDimensions(),
    });
    this.windowFacade.addEventListener('resize', this.handleResize);
  }

  /**
   * Handles a "resize" event on the viewport.
   */
  public handleResize(): void {
    if (this.resizeTimeoutId === null) {
      this.resizeTimeoutId = global.setTimeout(() => {
        this.resizeTimeoutId = null;
        this.setState({
          viewport: this.windowFacade.getViewportDimensions(),
        });
       }, 33);
    }
  }

  /**
   * Executes the cleanup necessary to stop listening and handling to "resize"
   * events.
   */
  private stopResizeHandling(): void {
    if (this.resizeTimeoutId !== null) {
      global.clearTimeout(this.resizeTimeoutId);
    }
    this.windowFacade.removeEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    this.stopResizeHandling();
  }

  render() {
    const children: JSX.Element[] = [];
    if (this.state.gameConfig !== null && this.state.viewport !== null) {
      children.push(<Menu key='menu' onNewGame={this.handleNewGame}
        onResetGame={this.handleResetGame}/>);
      children.push(<Game key={this.state.gameId} viewport={this.state.viewport}
        gameConfig={this.state.gameConfig}/>);
    } else {
      children.push(<Setup key='setup' onStart={this.handleStart}/>);
    }

    return(
      <div id='app' style={Styles.app}>
        {children}
      </div>
    );
  }
}