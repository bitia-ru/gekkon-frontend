// eslint-disable-next-line import/newline-after-import,import/order
import { SentryDsn } from './Environ';
Sentry.init({ dsn: SentryDsn }); // eslint-disable-line no-undef

/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Main from './Main';
import store from '../v1/store';
import './index.css';
import './fonts.css';
/* eslint-enable import/first */

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'),
);
