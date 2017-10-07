import { combineReducers } from "redux";
import user from "./user";
import students from "./student";
import tasks from "./task";
import rewards from "./rewards";
import rewardOptions from "./rewardOptions";
import notifications from "./notifications";
import classrooms from "./classrooms";

import { START_REQUEST, FAILURE_REQUEST } from "../actions/index";

const status = {
  isFetching: false,
  error: null
};
const reducer = (state = status, action) => {
  switch (action.type) {
    case FAILURE_REQUEST:
      return {
        ...state,
        error: action.data
      };
    case START_REQUEST:
      return {
        ...state,
        error: action.data
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user,
  students,
  tasks,
  rewards,
  rewardOptions,
  notifications,
  classrooms,
  status: reducer
});

export default rootReducer;