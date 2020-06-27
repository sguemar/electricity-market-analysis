import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import store from './redux/store';
import { Provider } from 'react-redux';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Importing AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);