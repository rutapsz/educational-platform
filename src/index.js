import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from "axios";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

axios.defaults.withCredentials = true; // even for get requests if
                                    // demand session authentication
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'x-csrftoken'