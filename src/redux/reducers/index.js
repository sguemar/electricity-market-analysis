import { combineReducers } from "redux";
import authentication from "./authentication";
import notifyReducer from 'react-redux-notify';

export default combineReducers({
  authentication,
  notifications: notifyReducer
});
