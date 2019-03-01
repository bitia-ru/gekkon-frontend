import React           from 'react';
import ReactDOM        from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {createStore}   from 'redux';
import {Provider}      from 'react-redux';
import rootReducer     from './reducers';
import Main            from './Main';
import './index.css';
import './fonts.css';

const store = createStore(rootReducer);

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <Main/>
        </BrowserRouter>
    </Provider>
), document.getElementById('app'));


