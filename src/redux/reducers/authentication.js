import { LOGIN_CUSTOMER, LOGIN_COMPANY, LOGOUT_USER } from "../constants/authentication";

const initialState = {
  loggedUser: {
    username: false,
    userType: false,
    companyType: false
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_CUSTOMER: {
      const { username, userType } = action.payload;
      return {
        loggedUser: {
          username: username,
          userType: userType,
          companyType: false
        }
      };
    }
    case LOGIN_COMPANY: {
      const { username, userType, companyType } = action.payload;
      return {
        loggedUser: {
          username: username,
          userType: userType,
          companyType: companyType
        }
      };
    }
    case LOGOUT_USER: {
      return initialState;
    }
    default:
      return state;
  }
}