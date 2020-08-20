import { LOGIN_CUSTOMER, LOGIN_COMPANY, LOGOUT_USER } from "../constants/authentication";

const initialState = {
  loggedUser: {
    username: false,
    type: false,
    company_type: false
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
          company_type: false
        }
      };
    }
    case LOGIN_COMPANY: {
      const { username, type, company_type } = action.payload;
      return {
        loggedUser: {
          username: username,
          type: type,
          company_type: company_type
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