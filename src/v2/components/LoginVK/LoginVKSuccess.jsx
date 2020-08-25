import React from 'react';

class LoginVKSuccess extends React.PureComponent {
  componentDidMount() {
    window.opener.postMessage({ result: 'success' }, '*');
  }

  render() {
    return (
      <div>
        Success!
      </div>
    );
  }
}

export default LoginVKSuccess;
