// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Import your global styles
import App from './App'; // Import your main App component
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to measure performance, reportWebVitals can send results
// to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
