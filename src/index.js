import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store, UserProfilePage } from './App';
import "./app.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <UserProfilePage />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


