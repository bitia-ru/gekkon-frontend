import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const LoginVKError = ({ match }) => {
  const { msg } = match.params;

  return (
    <div dangerouslySetInnerHTML={{ __html: msg }} />
  );
};

LoginVKError.propTypes = {
  match: PropTypes.object,
  msg: PropTypes.string,
};


export default withRouter(LoginVKError);
