import * as React from 'react';
import * as Styles from '../../styles';

export interface IFlagsEnabledProps {
  checked: boolean,
  onChange: (event: React.ChangeEvent<HTMLElement>) => void,
}

export class FlagsEnabled extends React.Component<IFlagsEnabledProps, {}> {
  render() {
    return(
      <p key='flags-enabled'>
        <input type='checkbox' id='flags-enabled' onChange={this.props.onChange}
          checked={this.props.checked} style={Styles.flagsEnabledCheckbox}/>
        <label htmlFor='flags-enabled' style={Styles.flagsEnabledLabel}>
          Enable flags
        </label>
      </p>
    );
  }
}