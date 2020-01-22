import React from 'react';
import { StyleSheet, css } from '../aphrodite';


class LeftPanelList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
    };
  }

  render() {
    const { options, onOptionSelected } = this.props;

    return (
      <>
        {
          Object.keys(options).map(
            (id, index) => {
              const option = options[id];
              return (
                <div
                  className={css(style.option, index == this.state.currentIndex && style.selected)}
                  onClick={
                    () => {
                      if (index === this.state.currentIndex) {
                        return;
                      }

                      this.setState({ currentIndex: index });
                      onOptionSelected(id);
                    }
                  }
                >
                  {option}
                </div>
              );
            },
          )
        }
      </>
    );
  }
}

const style = StyleSheet.create({
  option: {
    fontWeight: 900,
    color: '#62737B',
    backgroundColor: 'white',
    padding: '10px 40px',

    ':hover': {
      fontFamily: 'GilroyBold',
      cursor: 'pointer',
      color: '#006CEB',
      backgroundColor: 'rgba(0, 108, 235, 0.12)',
    },
  },
  selected: {
    color: '#006CEB',
    backgroundColor: 'rgba(0, 108, 235, 0.08)',
  },
});

export default LeftPanelList;
