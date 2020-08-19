import { LOGIN_USER, LOGOUT_USER } from "../constants/authentication";

const initialState = {
  loggedUser: {
    username: false,
    type: false
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER: {
      const { username, type } = action.payload;
      return {
        loggedUser: {
          username: username,
          type: type
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