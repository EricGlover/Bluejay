import {
  REMOVE_NOTIFICATION,
  GET_ALL_NOTIFICATIONS,
  CLEAR_ALL_NOTIFICATIONS
} from "../actions/notifications";

export const notificationInitState = [];

const notifications = (state = [], action) => {
  switch (action.type) {
    case GET_ALL_NOTIFICATIONS:
      return [...action.data];
    case REMOVE_NOTIFICATION:
      return state.filter(notification => notification._id !== action.data);
    case CLEAR_ALL_NOTIFICATIONS:
      return [];
    default:
      return state;
  }
};

export default notifications;
