import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { DISPLAYED_DEFAULT } from '@/v1/Constants/TooltipPerson';
import { StyleSheet, css } from '../../aphrodite';

export default class TooltipPerson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayFull: false,
    };
  }

  render() {
    const {
      title, position, users, hide, cancelHide,
    } = this.props;
    const { displayFull } = this.state;
    return (
      <>
        {
          users.length > 0 && <div
            className={css(styles.modalTrackCountTooltip,
              position === 'left' ? styles.modalTrackCountTooltipLeft : '',
              position === 'center' ? styles.modalTrackCountTooltipCenter : '')}
            onMouseEnter={cancelHide}
            onMouseLeave={hide}
            style={{ zIndex: 1000, cursor: 'pointer', outline: 'none' }}
            onClick={() => this.setState({ displayFull: true })}
            role="button"
            tabIndex={0}
          >
            <div className={css(styles.modalTrackCountTooltipTitle)}>
              {title}
            </div>
            <div className={css(styles.modalAvatarBlock, displayFull ? styles.modalAvatarBlockVertical : '')}>
              {
                R.map(
                  user => (
                    <React.Fragment key={user.id}>
                      {
                        displayFull
                          ? (
                            <div className={css(styles.modalPersonBlock)} style={{ cursor: 'pointer' }}>
                              <div className={css(styles.modalAvatar, styles.modalAvatarPerson)}>
                                {
                                  user.avatar
                                    ? (
                                      <img
                                        src={user.avatar.url}
                                        alt={user.name ? user.name : user.login}
                                      />
                                    )
                                    : ''
                                }
                              </div>
                              <p className={css(styles.modalAvatarName)}>
                                {user.name ? user.name : user.login}
                              </p>
                            </div>
                          )
                          : (
                            <div
                              className={css(styles.modalAvatar, styles.modalAvatarPerson)}
                              title={user.name ? user.name : user.login}
                            >
                              {
                                user.avatar
                                  ? (
                                    <img
                                      src={user.avatar.url}
                                      alt={user.name ? user.name : user.login}
                                    />
                                  )
                                  : ''
                              }
                            </div>
                          )
                      }
                    </React.Fragment>
                  ),
                  displayFull ? users : R.slice(0, DISPLAYED_DEFAULT, users),
                )
              }
              {
                (!displayFull && users.length > DISPLAYED_DEFAULT) && <div
                  className={css(styles.modalAvatar)}
                >
                  {`+${users.length - DISPLAYED_DEFAULT}`}
                </div>
              }
            </div>
          </div>
        }
      </>);
  }
}

const styles = StyleSheet.create({
  modalTrackCountTooltip: {
    minWidth: '222px',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(31, 31, 31, 0.9)',
    padding: '12px',
    position: 'absolute',
    content: '\'\'',
    bottom: 'calc(100% + 16px)',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '4px 4px 0 4px',
      borderColor: 'rgba(31, 31, 31, 0.9) transparent transparent transparent',
    },
  },
  modalTrackCountTooltipLeft: {
    left: '-14px',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      top: '100%',
      left: '20px',
    },
  },
  modalTrackCountTooltipCenter: {
    left: '50%',
    transform: 'translateX(-50%)',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
  },
  modalTrackCountTooltipTitle: {
    lineHeight: '12px',
    whiteSpace: 'nowrap',
    color: '#ffffff',
    fontSize: '12px',
    fontFamily: ['GilroyBold', 'sans-serif'],
    marginBottom: '8px',
  },
  modalAvatarBlock: {
    display: 'flex',
    marginLeft: '-3px',
    marginRight: '-3px',
  },
  modalAvatarBlockVertical: {
    height: '220px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  modalPersonBlock: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '5px',
    paddingBottom: '5px',
    height: '44px',
    boxSizing: 'border-box',
    textDecoration: 'none',
    transition: 'background-color .3s ease-out',
    ':hover': {
      backgroundColor: 'rgba(235, 235, 235, 0.2)',
    },
  },
  modalAvatar: {
    width: '34px',
    height: '34px',
    backgroundColor: '#F3F3F3',
    borderRadius: '50%',
    overflow: 'hidden',
    marginLeft: '3px',
    marginRight: '3px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '10px',
    color: '#888888',
    textDecoration: 'none',
    fontFamily: ['GilroyBold', 'sans-serif'],
    border: 'none',
    '> img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  modalAvatarPerson: {
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M22.9803%208.71906C22.9803%2013.1525%2019.3843%2016.7486%2014.9508%2016.7486C10.5172%2016.7486%206.9212%2013.1279%206.9212%208.71906C6.9212%204.31019%2010.5173%200.714111%2014.9508%200.714111C19.3842%200.714111%2022.9803%204.28559%2022.9803%208.71906ZM20.8621%208.71906C20.8621%205.4678%2018.202%202.80772%2014.9508%202.80772C11.6995%202.80772%209.03941%205.46775%209.03941%208.71901C9.03941%2011.9703%2011.6995%2014.6304%2014.9508%2014.6304C18.202%2014.6304%2020.8621%2011.9703%2020.8621%208.71906ZM28.9409%2029.2856H1.0591C0.467973%2029.2856%200%2028.8177%200%2028.2265C0%2022.66%204.53203%2018.1526%2010.0739%2018.1526H19.9261C25.4926%2018.1526%2030%2022.6846%2030%2028.2265C30%2028.8177%2029.532%2029.2856%2028.9409%2029.2856ZM19.9261%2020.2708H10.0739C6.0345%2020.2708%202.70933%2023.3004%202.19211%2027.1674H27.8079C27.2906%2023.2758%2023.9655%2020.2708%2019.9261%2020.2708Z%22%20fill%3D%22%23BDBDBD%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '15px 15px',
    backgroundPosition: 'center',
  },
  modalAvatarName: {
    fontFamily: ['GilroyRegular', 'sans-serif'],
    fontSize: '12px',
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    marginLeft: '12px',
  },
});

TooltipPerson.propTypes = {
  users: PropTypes.array,
  position: PropTypes.string,
  title: PropTypes.string,
  hide: PropTypes.func.isRequired,
  cancelHide: PropTypes.func.isRequired,
};

TooltipPerson.defaultProps = {
  users: [],
  position: 'center',
  title: '',
};
