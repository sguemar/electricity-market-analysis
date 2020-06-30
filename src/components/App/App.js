import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Home from '../Home/Home';
import Login from '../Login/Login';
import SignUp from '../SignUp/SignUp';
import NoMatch from '../NoMatch/NoMatch';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';


const App = ({ username }) => {
  return (
    <div className="app">
      <Router>
        <Header loggedUser={username} />
        <div className="main-content">
          <main>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/login" exact>
                {username ? <Redirect to="/" /> : <Login />}
              </Route>
              <Route path="/signup" exact>
                {username ? <Redirect to="/" /> : <SignUp />}
              </Route>
              <Route component={NoMatch} />
            </Switch>
          </main>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

const mapStateToProps = state => {
  const { authentication } = state;
  return authentication.loggedUser;
};

export default connect(mapStateToProps)(App);