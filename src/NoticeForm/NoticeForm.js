import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import './NoticeForm.css';

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
      <div className="modal-block__notice-message">
        <div className="notice-message notice-message_left-side">
          <form action="#" className="form">
            <h4 className="notice-message__title">Опишите обнаруженную ошибку</h4>
            <textarea
              className="form__textarea"
              value={text}
              onChange={event => this.setState({ text: event.target.value })}
            />
            <div className="notice-message__button-block">
              <div className="notice-message__button-col">
                <Button
                  size="small"
                  style="gray"
                  title="Отмена"
                  onClick={cancel}
                />
              </div>
              <div className="notice-message__button-col">
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

NoticeForm.propTypes = {
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};
