import * as Event from "./events";
import { unassignTask, bulkUnassign } from "./student";
import { startRequest, failedRequest } from "./index";
export const GET_ALL_TASKS = "GET_ALL_TASKS";
export const GET_ONE_TASK = "GET_ONE_TASK";
export const ADD_TASK = "ADD_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const REMOVE_TASK = "REMOVE_TASK";
export const UNASSIGN_STUDENT = "UNASSIGN_STUDENT";
export const BULK_UNASSIGN_STUDENTS = "BULK_UNASSIGN_STUDENTS";

// export const UNASSIGN_TASK = "UNASSIGN_TASK"

export const getTasks = data => ({
  type: GET_ALL_TASKS,
  data: data
});

const addTask = data => ({
  type: ADD_TASK,
  data: data
});

const updateTask = (id, data) => ({
  type: UPDATE_TASK,
  data: {
    id: id,
    task: data
  }
});
const removeTask = id => ({
  type: REMOVE_TASK,
  data: id
});
const unassignStudent = (studentId, taskId) => {
  return {
    type: UNASSIGN_STUDENT,
    data: {
      taskId,
      studentId
    }
  };
};
const bulkUnassignStudents = taskId => {
  return {
    type: BULK_UNASSIGN_STUDENTS,
    data: taskId
  };
};

export const hydrateTeacherTasks = userId => async dispatch => {
  console.log("attempting to hydrate teacher tasks ");
  try {
    let response = await fetch(`api/teachers/${userId}/tasks`, {
      method: "GET",
      credentials: "include"
    });
    response = await response.json();
    if (!response.success) {
      throw new Error(response.apiError.message);
    }
    dispatch(getTasks(response.apiData));
  } catch (error) {
    console.log(error);
  }
};

export const hydrateStudentTasks = userId => async dispatch => {
  try {
    let response = await fetch(`api/students/${userId}/tasks`, {
      method: "GET",
      credentials: "include"
    });
    response = await response.json();
    if (!response.success) {
      throw new Error(response.apiError.message);
    }
    dispatch(getTasks(response.apiData));
  } catch (error) {
    console.log(error);
  }
};

//unassign a single task from a student
export const unAssignTask = (task, studentId) => async dispatch => {
  dispatch(startRequest());
  try {
    let response = await fetch(`api/tasks/${task._id}/unassign/${studentId}`, {
      method: "PATCH",
      credentials: "include"
    });
    let data = await response.json();
    if (!data.success) {
      throw new Error(response.apiError.message);
    }
    //update the student and the task
    dispatch(unassignTask(studentId, task._id));
    dispatch(unassignStudent(studentId, task._id));
  } catch (error) {
    //dispatch error
    console.error(error);
    dispatch(failedRequest(error));
  }
};
export const bulkUnassignTask = (task, studentIds) => async dispatch => {
  dispatch(startRequest());
  try {
    ///****old code
    // console.log(studentIds);
    // let calls = studentIds.map(studentId => {
    //   return fetch(`api/tasks/${task._id}/unassign/${studentId}`, {
    //     method: "PATCH",
    //     credentials: "include"
    //   });
    // });
    // console.log("calls = ", calls);
    // let responses = await Promise.all(calls);
    // console.log("responses =", responses);
    // let data = responses.map(response => response.json());
    // let unpackedData = await Promise.all(data);

    //
    // if (unpackedData.every(data => data.success)) {
    //   dispatch(bulkUnassign(studentIds, task._id));
    // } else {
    //   console.error("problems in Bulk Unassign");
    //   console.log("unpackedData = ", unpackedData);
    //   dispatch(failedRequest("problems in Bulk Unassign"));
    // }
    ///****old code
    let serverResponse = await fetch(`api/tasks/${task._id}/bulkunassign`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ studentIds: studentIds })
    });
    serverResponse = await serverResponse.json();
    if (serverResponse.success) {
      //update the students and the tasks
      dispatch(bulkUnassign(studentIds)); //a student redux store action
      dispatch(bulkUnassignStudents(task._id)); //a task redux store action
    } else {
      console.error("problems in Bulk Unassign");
      console.log("serverResponse = ", serverResponse);
      dispatch(failedRequest(serverResponse.apiError));
    }
  } catch (error) {
    //dispatch error
    dispatch(failedRequest(error));
    console.log(error);
  }
};

export const completeTask = (s_id, t_id, socket) => async dispatch => {
  try {
    let response = await fetch(`api/students/${s_id}/complete/${t_id}`, {
      method: "PATCH",
      credentials: "include"
    });
    response = await response.json();
    console.log(response);
    if (!response.success) {
      throw new Error(response.apiError.message);
    }
    socket.emit(Event.SEND_NOTIFICATION, response.apiData.teacher);
    // dispatch(updateTask(t_id, response.apiData));
  } catch (error) {
    console.log(error);
  }
};
