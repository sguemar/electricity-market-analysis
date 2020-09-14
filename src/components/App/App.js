import React, { useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Home from '../Home/Home';
import Login from '../../features/authentication/Login';
import CustomerSignUp from '../../features/authentication/CustomerSignUp';
import CompanySignUp from '../../features/authentication/CompanySignUp';
import NoMatch from '../NoMatch/NoMatch';
import Invoices from '../../features/customers/Invoices';
import Consumptions from '../../features/customers/Consumptions';
import CustomerProfile from '../../features/customers/Profile';
import CompanyProfile from '../../features/companies/Profile';
import Offers from '../../features/companies/Offers';
import CreateOffer from '../../features/companies/CreateOffer';
import EditOffer from '../../features/companies/EditOffer';
import MyCustomers from '../../features/companies/MyCustomers';
import ReceivedOffers from '../../features/customers/ReceivedOffers';
import AnalyzeOffers from '../../features/public/AnalyzeOffers';
import CustomerComparePrices from '../../features/customers/ComparePrices';
import TradingCompanyComparePrices from '../../features/companies/TradingCompanyComparePrices';
import CompaniesPerRegion from '../../features/public/CompaniesPerRegion';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Notify, removeAllNotifications } from 'react-redux-notify';


const App = ({ username, userType, companyType, removeAllNotifications }) => {

  useEffect(() => {
    window.onunload = () => {
      removeAllNotifications();
    }
  });

  return (
    <div className="app">
      <Router>
        <Header
          username={username}
          userType={userType}
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
              <Route path="/companies-per-region" exact>
                {username ? <Redirect to="/" /> : <CompaniesPerRegion />}
              </Route>
              <Route path="/profile" exact>
                {username ?
                  <>
                    {userType === 1 ? <CustomerProfile /> : <CompanyProfile />}
                  </>
                  :
                  <Login />
                }
              </Route>
              <Route path="/consumptions" exact>
                {username ?
                  <>
                    {userType === 1 ? <Consumptions /> : <Redirect to="/" />}
                  </>
                  :
                  <Login />
                }
              </Route>
              <Route path="/received-offers" exact>
                {username
                  ?
                  <>
                    {userType === 1
                      ?
                      <ReceivedOffers />
                      :
                      <Redirect to="/" />
                    }
                  </>
                  :
                  <Login />
                }
              </Route>
              <Route path="/analyze-offers" exact>
                <AnalyzeOffers companyType={companyType} />
              </Route>
              <Route path="/compare-prices" exact>
                {username
                  ?
                  <>
                    {userType === 1
                      ?
                      <CustomerComparePrices />
                      :
                      <>
                        {companyType === 0
                          ?
                          <TradingCompanyComparePrices />
                          :
                          <Redirect to="/" />
                        }
                      </>
                    }
                  </>
                  :
                  <Login />
                }
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
              <Route path="/edit-offer/:offerId">
                {username
                  ?
                  <>
                    {companyType === 0
                      ?
                      <EditOffer />
                      :
                      <Redirect to="/" />
                    }
                  </>
                  :
                  <Login />
                }
              </Route>
              <Route path="/my-customers">
                {username
                  ?
                  <>
                    {companyType === 0
                      ?
                      <MyCustomers />
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

const mapDispatchToProps = dispatch => ({
  removeAllNotifications: (config) => {
    dispatch(removeAllNotifications(config))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(App);