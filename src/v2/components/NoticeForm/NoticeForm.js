import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import { StyleSheet, css } from '../../aphrodite';

export default class NoticeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  render() {
    const { submit, cancel } = this.props;
    const { text } = this.state;
    return (
      <div className={css(styles.modalBlockNoticeMessage)}>
        <div className={css(styles.noticeMessage, styles.noticeMessageLeftSide, styles.showNoticeMessageFromLeft)}>
          <form action="#" className="form">
            <h4 className={css(styles.noticeMessageTitle)}>Опишите обнаруженную ошибку</h4>
            <textarea
              className={css(styles.formTextarea)}
              value={text}
              onChange={event => this.setState({ text: event.target.value })}
            />
            <div className={css(styles.noticeMessageButtonBlock)}>
              <div className={css(styles.noticeMessageButtonCol)}>
                <Button
                  size="small"
                  style="gray"
                  title="Отмена"
                  onClick={cancel}
                />
              </div>
              <div className={css(styles.noticeMessageButtonCol)}>
                <Button
                  size="small"
                  style="normal"
                  title="Отправить"
                  fullLength={false}
                  onClick={() => submit(text)}
                  isWaiting={false}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  modalBlockNoticeMessage: {
    position: 'absolute',
    content: '\'\'',
    right: 'calc(100% + 12px)',
    minWidth: '350px',
    width: '100%',
    top: '-3px',
  },
  noticeMessage: {
    width: '100%',
    padding: '20px',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    opacity: '0',
  },
  noticeMessageLeftSide: {
    opacity: '0',
    transition: 'opacity .4s ease-out',
    animation: 'show-notice-message-from-left .3s .2s forwards',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      left: '100%',
      top: '12px',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth: '5px 0 5px 6px',
      borderColor: 'transparent transparent transparent #ffffff',
    },
  },
  showNoticeMessageFromLeft: {
    animationName: [{
      '0%': {
        transform: 'translateX(-10px)',
      },
      '100%': {
        transform: 'translateX(0)',
      },
    }, {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    }],
  },
  noticeMessageButtonBlock: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '-6px',
    marginRight: '-6px',
    marginTop: '10px',
  },
  noticeMessageButtonCol: {
    marginLeft: '6px',
    marginRight: '6px',
  },
  noticeMessageTitle: {
    marginTop: '0',
    marginBottom: '12px',
    lineHeight: '1em',
    fontSize: '16px',
    fontFamily: ['GilroyBold', 'sans-serif'],
    color: '#1f1f1f',
  },
  formTextarea: {
    width: '100%',
    height: '150px',
    border: '1px solid #DDE2EF',
    outline: 'none',
    transition: 'box-shadow .4s ease-out',
    resize: 'none',
    padding: '12px 12px',
    boxSizing: 'border-box',
    color: '#828282',
    fontSize: '16px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    overflowX: 'hidden',
    ':focus': {
      boxShadow: '0px 0px 0px 2px rgba(0, 108, 235, 0.7)',
    },
  },
});

NoticeForm.propTypes = {
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};
