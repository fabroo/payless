import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './assets/fonts/beat/GT-Pressura-Bold.otf';
import './assets/fonts/didi/Aspira-Wide-Bold.otf';
import './assets/fonts/cabi/CabifyCircularWeb-Bold.otf';
import './assets/fonts/uber/UberMoveBold.otf';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals