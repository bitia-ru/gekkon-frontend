// eslint-disable-next-line import/newline-after-import,import/order
import { SentryDsn } from './Environ';
Sentry.init({ dsn: SentryDsn }); // eslint-disable-line no-undef

/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import Main from './Main';
import './index.css';
import './fonts.css';
/* eslint-enable import/first */

const store = createStore(
  rootReducer,
  {},
  applyMiddleware(thunk),
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'),
);
