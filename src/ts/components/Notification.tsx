'use strict';
import * as React from 'react';
import { StylishButton } from './StylishButton';
import * as Styles from '../styles';

export interface INotificationProps {
  id: string,
  notifText: string,
}

export interface INotificationState {
  hideNotif: boolean,
}

export class Notification extends
React.Component<INotificationProps, INotificationState> {
  constructor(props: INotificationProps) {
    super(props);
    this.state = { hideNotif: false };

    this.handleHide = this.handleHide.bind(this);
  }

  /**
   * Handles hiding the game notification element.
   */
  public handleHide(): void {
    this.setState({ hideNotif: true });
  }

  render() {
    if (this.state.hideNotif) {
      return('');
    }

    return(
      <div id={this.props.id} style={Styles.notification}>
        <p>{this.props.notifText}</p>
        <StylishButton id='' styles={Styles.notificationButton} text='Ok'
          events={{ onClick: this.handleHide }}/>
      </div>
    );
  }
}