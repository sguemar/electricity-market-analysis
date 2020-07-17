import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Home from '../Home/Home';
import Login from '../Login/Login';
import CustomerSignUp from '../SignUp/CustomerSignUp';
import CompanySignUp from '../SignUp/CompanySignUp';
import NoMatch from '../NoMatch/NoMatch';
import Invoices from '../Invoices/Invoices';

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
              <Route path="/invoices" exact>
                {username ? <Invoices /> : <Login />}
              </Route>
              <Route path="/login" exact>
                {username ? <Redirect to="/" /> : <Login />}
              </Route>
              <Route path="/signup-customer" exact>
                {username ? <Redirect to="/" /> : <CustomerSignUp />}
              </Route>
              <Route path="/signup-company" exact>
                {username ? <Redirect to="/" /> : <CompanySignUp />}
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