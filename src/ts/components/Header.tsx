'use strict';
import * as React from 'react';
import * as Styles from '../styles';

export interface IHeaderProps {
  minesLeft: number,
  lives: number,
  gameEnded: boolean,
}

export interface IHeaderState {
  timer: number,
}

export class Header extends React.Component<IHeaderProps, IHeaderState> {
  private intervalId: NodeJS.Timer | null = null;

  constructor(props: IHeaderProps) {
    super(props);
    this.state = { timer: 0 };
  }

  componentDidMount() {
    this.intervalId = global.setInterval(() => {
      this.setState(prevState => {
        return({ timer: prevState.timer + 1 });
      });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      global.clearInterval(this.intervalId);
    }
  }

  render() {
    if (this.props.gameEnded && this.intervalId) {
      global.clearInterval(this.intervalId);
    }

    const timer = this.state.timer;
    const timerMinutes: string = `${Math.floor(timer / 60)}`.padStart(2, '0');
    const timerSeconds: string = `${timer % 60}`.padStart(2, '0');

    return(
      <div id='header' style={Styles.header}>
        <div id='game-timer' style={Styles.headerTimer}>
          <img src='/img/timer.png'  style={Styles.headerTimerImg}
            alt='game timer'/>
          {`${timerMinutes}:${timerSeconds}`}
        </div>
        <div id='mines-left' style={Styles.headerMines}>
          <img src='/img/mine.png'  style={Styles.headerMinesImg}
            alt='mines left'/>
          {this.props.minesLeft}
        </div>
        <div id='lives' style={Styles.headerLives}>
          <img src='/img/lives.png'  style={Styles.headerLivesImg}
            alt='lives left'/>
          {this.props.lives}
        </div>
      </div>
    );
  }
}