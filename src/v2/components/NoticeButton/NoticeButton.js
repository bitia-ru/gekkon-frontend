import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const NoticeButton = ({ onClick }) => (
  <button type="button" className={css(styles.notice)} onClick={onClick} />
);

const styles = StyleSheet.create({
  notice: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    border: '0',
    boxShadow: 'none',
    outline: 'none',
    cursor: 'pointer',
    padding: '0',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2217%22%20height%3D%2217%22%20viewBox%3D%220%200%2017%2017%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M8.5%200C3.80585%200%200%203.80585%200%208.5C0%2013.1947%203.80585%2017%208.5%2017C13.1947%2017%2017%2013.1952%2017%208.5C17%203.80585%2013.1946%200%208.5%200ZM8.5%2015.4062C4.68565%2015.4062%201.59378%2012.3144%201.59378%208.5C1.59378%204.68565%204.68565%201.59378%208.5%201.59378C12.3144%201.59378%2015.4062%204.68565%2015.4062%208.5C15.4062%2012.3144%2012.3144%2015.4062%208.5%2015.4062ZM8.50054%203.72776C7.89174%203.72776%207.4311%204.04547%207.4311%204.55865V9.26551C7.4311%209.77922%207.89168%2010.0959%208.50054%2010.0959C9.09447%2010.0959%209.56997%209.76596%209.56997%209.26551V4.55865C9.56991%204.05766%209.09447%203.72776%208.50054%203.72776ZM8.50054%2011.1563C7.91563%2011.1563%207.4396%2011.6323%207.4396%2012.2177C7.4396%2012.802%207.91563%2013.2781%208.50054%2013.2781C9.08544%2013.2781%209.56093%2012.802%209.56093%2012.2177C9.56087%2011.6322%209.08544%2011.1563%208.50054%2011.1563Z%22%20fill%3D%22%23C4C4C4%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    transition: 'opacity .4s ease-out',
    ':hover': {
      opacity: '.6',
    },
  },
// .notice:hover + .modal-block__notice-tooltip {
//     display: 'block',
// },
// .notice_active:hover + .modal-block__notice-tooltip {
//     display: 'none',
// },
});

NoticeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default NoticeButton;
