'use strict';
import * as React from 'react';
import { IStylishButtonStyles } from '../Interfaces';
import { ButtonHTMLAttributes } from 'react';

interface IEvents {
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onMouseUp?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void,
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void,
}

export interface IStylishButtonProps {
  id: string,
  styles: IStylishButtonStyles,
  text: string,
  events: { [key: string]: () => void },
}

export interface IStylishButtonState {
  isActivated: boolean,
  isFocused: boolean,
  isHovered: boolean,
}

export class StylishButton extends
React.Component<IStylishButtonProps, IStylishButtonState> {
  constructor(props: IStylishButtonProps) {
    super(props);
    this.state = {
      isActivated: false,
      isHovered: false,
      isFocused: false,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  /**
   * Handles setting the button as being Active.
   */
  public handleMouseDown(event: React.MouseEvent<HTMLButtonElement>): void {
    if (event.button !== 0) {
      return;
    }
    this.setState({ isActivated: true });
  }

  /**
   * Handles setting the button as not being Active.
   */
  public handleMouseUp(event: React.MouseEvent<HTMLButtonElement>): void {
    if (event.button !== 0) {
      return;
    }
    this.setState({ isActivated: false });
  }

  /**
   * Handles setting the button as being Hovered.
   */
  public handleMouseEnter(event: React.MouseEvent<HTMLButtonElement>): void {
    this.setState({ isHovered: true });
  }

  /**
   * Handles setting the button as not being Hovered.
   */
  public handleMouseLeave(event: React.MouseEvent<HTMLButtonElement>): void {
    this.setState({ isHovered: false });
  }

  /**
   * Handles setting the button as being Focused.
   */
  public handleFocus(event: React.FocusEvent<HTMLButtonElement>): void {
    this.setState({ isFocused: true });
  }

  /**
   * Handles setting the button as not being Focused.
   */
  public handleBlur(event: React.FocusEvent<HTMLButtonElement>): void {
    this.setState({ isFocused: false });
  }

  render() {
    const events: IEvents = {};
    if (this.props.styles[':hover'] !== undefined) {
      events.onMouseEnter = this.handleMouseEnter;
      events.onMouseLeave = this.handleMouseLeave;
    }
    if (this.props.styles[':active'] !== undefined) {
      events.onMouseDown = this.handleMouseDown;
      events.onMouseUp = this.handleMouseUp;
    }
    if (this.props.styles[':focus'] !== undefined) {
      events.onFocus = this.handleFocus;
      events.onBlur = this.handleBlur;
    }

    let styles: React.CSSProperties = { ...this.props.styles.base };
    if (this.state.isHovered) {
      styles = { ...styles, ...this.props.styles[':hover'] };
    }
    if (this.state.isActivated) {
      styles = { ...styles, ...this.props.styles[':active'] };
    }
    if (this.state.isFocused) {
      styles = { ...styles, ...this.props.styles[':focus'] };
    }

    return(
      <button id={this.props.id} style={styles} {...this.props.events}
        {...events}>{this.props.text}</button>
    );
  }
}