import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//Adding Router
import {BrowserRouter} from 'react-router-dom';
//Http library
import axios from 'axios';
//Redux
import {createStore} from 'redux';
import { Provider } from 'react-redux';
import reducer from './store/reducers/reducer';

const store = createStore(reducer,/* preloadedState, */
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

//Axios default settings 
// axios.defaults.baseURL = 'https://tm-api.sergejvukovic.com';
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.authToken}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const app = (
<Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
