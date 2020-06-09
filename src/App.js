import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import NoMatch from './components/NoMatch';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import './app.css';

function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route component={NoMatch} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
