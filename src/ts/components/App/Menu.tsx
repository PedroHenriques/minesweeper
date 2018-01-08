'use strict';
import * as React from 'react';
import { StylishButton } from '../StylishButton';
import * as Styles from '../../styles';

export interface IMenuProps {
  onNewGame: () => void,
  onResetGame: () => void,
}

export class Menu extends React.Component<IMenuProps, {}> {
  render() {
    return(
      <div id='menu' style={Styles.menu}>
        <StylishButton id='new-game-btn' styles={Styles.newGameButton}
          text='New Game' events={{ onClick: this.props.onNewGame }}/>
        <StylishButton id='reset-game-btn' styles={Styles.resetGameButton}
          text='Reset Game' events={{ onClick: this.props.onResetGame }}/>
        <a href='https://github.com/PedroHenriques/Minesweeper' target='_blank'
          style={Styles.githubLink}>Source Code</a>
      </div>
    );
  }
}