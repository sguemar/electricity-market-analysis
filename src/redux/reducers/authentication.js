import { LOGIN_CUSTOMER, LOGIN_COMPANY, LOGOUT_USER } from "../constants/authentication";

const initialState = {
  loggedUser: {
    username: false,
    type: false,
    companyType: false
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_CUSTOMER: {
      const { username, type } = action.payload;
      return {
        loggedUser: {
          username: username,
          type: type,
          companyType: false
        }
      };
    }
    case LOGIN_COMPANY: {
      const { username, type, companyType } = action.payload;
      return {
        loggedUser: {
          username: username,
          type: type,
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