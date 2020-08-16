import { LOGIN_USER, LOGOUT_USER } from "../constants/authentication";

const initialState = {
  loggedUser: {
    username: ''
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER: {
      const { username } = action.payload;
      return {
        loggedUser: {
          username: username,
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