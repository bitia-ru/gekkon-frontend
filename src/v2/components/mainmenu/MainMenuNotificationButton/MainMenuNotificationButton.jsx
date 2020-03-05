import React from 'react';
import MainMenuNotificationButtonLayout from './MainMenuNotificationButtonLayout';

class MainMenuNotificationButton extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  render() {
    const { expanded } = this.state;

    return (
      <MainMenuNotificationButtonLayout
        expanded={expanded}
        onRingerClick={() => {
          this.setState({ expanded: true });
        }}
        onFocusOut={() => {
          this.setState({ expanded: false });
        }}
      >
        {this.props.children}
      </MainMenuNotificationButtonLayout>
    );
  }
}

export default MainMenuNotificationButton;