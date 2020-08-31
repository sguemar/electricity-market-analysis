import { LOGIN_CUSTOMER, LOGIN_COMPANY, LOGOUT_USER } from '../constants/authentication';

export const loginCustomer = (user) => {
  return {
    type: LOGIN_CUSTOMER,
    payload: user
  };
}

export const loginCompany = (user) => {
  return {
    type: LOGIN_COMPANY,
    payload: user
  };
}

export const logout = () => {
  return {
    type: LOGOUT_USER
  };
}