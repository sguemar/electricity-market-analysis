import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Home from '../Home/Home';
import Login from '../Login/Login';
import CustomerSignUp from '../SignUp/CustomerSignUp';
import CompanySignUp from '../SignUp/CompanySignUp';
import NoMatch from '../NoMatch/NoMatch';
import Invoices from '../Invoices/Invoices';
import Consumptions from '../Consumptions/Consumptions';
import CustomerProfile from '../Profile/CustomerProfile';
import CompanyProfile from '../Profile/CompanyProfile';
import Offers from '../Offers/Offers';
import CreateOffer from '../Offers/CreateOffer';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Notify } from 'react-redux-notify';


const App = ({ username, type, companyType }) => {
  return (
    <div className="app">
      <Router>
        <Header
          username={username}
          userType={type}
          companyType={companyType}
        />
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
              <Route path="/profile" exact>
                {username ?
                  <>
                    {type === 1 ? <CustomerProfile /> : <CompanyProfile />}
                  </>
                  :
                  <Login />
                }
              </Route>
              <Route path="/consumptions" exact>
                {username ? <Consumptions /> : <Login />}
              </Route>
              <Route path="/offers" exact>
                {username
                  ?
                  <>
                    {companyType === 0
                      ?
                      <Offers />
                      :
                      <Redirect to="/" />
                    }
                  </>
                  :
                  <Login />
                }
              </Route>
              <Route path="/create-offer" exact>
                {username
                  ?
                  <>
                    {companyType === 0
                      ?
                      <CreateOffer />
                      :
                      <Redirect to="/" />
                    }
                  </>
                  :
                  <Login />
                }
              </Route>
              <Route component={NoMatch} />
            </Switch>
          </main>
        </div>
        <Footer />
      </Router>
      <Notify />
    </div>
  );
}

const mapStateToProps = state => {
  const { authentication } = state;
  return authentication.loggedUser;
};

export default connect(mapStateToProps)(App);