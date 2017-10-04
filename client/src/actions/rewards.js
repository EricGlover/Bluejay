import { startRequest, failedRequest } from "./index";

export const GET_ALL_REWARDS = "GET_ALL_REWARDS";
export const GET_ONE_REWARD = "GET_ONE_REWARD";
export const ADD_REWARD = "ADD_REWARD";
export const UPDATE_REWARD = "UPDATE_REWARD";
export const REMOVE_REWARD = "REMOVE_REWARD";

export const getRewards = rewards => ({
  type: GET_ALL_REWARDS,
  data: rewards
});

const addReward = reward => ({
  type: ADD_REWARD,
  data: reward
});

const updateReward = (id, reward) => ({
  type: UPDATE_REWARD,
  data: {
    id: id,
    reward
  }
});

const removeReward = id => ({
  type: REMOVE_REWARD,
  data: id
});

//NOT IMPLEMENTED
//create a new kind of reward
export const createReward = (teacherId, reward) => async dispatch => {
  dispatch(startRequest());
  // teacher = await getTeacher(); //change this later after we store the user
  const teacher = null;
  // console.log("teacher = ", teacher);
  const defaultReward = {
    kind: "point",
    description: "new reward",
    value: "lots",
    teacher: teacher._id,
    status: "Unaccepted"
  };
  const response = await fetch(`/api/rewards`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: defaultReward
  });
  // console.log("response from createReward API = ", response);
  //TODO: double check that we're getting this back from server
  dispatch(addReward(response.apiData));
};

//get all the rewards for a teacher
export const getAllRewards = (userId, userKind) => async dispatch => {
  dispatch(startRequest());

  //use correct input for students and teachers
  let endpoint = `/api/teachers/${userId}/rewards`;
  if (userKind === "Student") {
    endpoint = `/api/students/${userId}/rewards`;
  }
  let response;
  try {
    response = await fetch(endpoint, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: null
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
  response = await response.json();
  if (!response.success) {
    console.error(response.apiError);
    return null;
  }
  dispatch(getRewards(response.apiData));
};

//NOT IMPLEMENTED
export const editReward = (id, editedReward) => async dispatch => {
  // dispatch(startRequest());
  // const response = await fetch(`/api/rewards`, {
  //   method: "PATCH",
  //   credentials: "include",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: editedReward
  // });
  // //do some things
  // if (!response.success) {
  //   dispatch(failedRequest(response.apiData));
  // }
  // const newReward = await response.json().apiData;
  // dispatch(updateReward(newReward._id, newReward));
};

//NOT TESTED
//TESTED, NON-FUNCTIONING, API => 500
export const deleteReward = id => async dispatch => {
  dispatch(startRequest());
  const response = await fetch(`/api/rewards/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: null
  });
  //TODO: SHOULD THESE USE THE response success flag?
  console.log("response = ", response);
  const data = await response.json();
  console.log("data = ", data);
  if (!data.success) {
    console.error(data);
    dispatch(failedRequest(data));
  } else {
    //delete from redux
    dispatch(removeReward(data.apiData._id));
  }
};

//
// //get all the rewards a student could ever choose from
// export const getStudentRewardOptions = classrooms => async dispatch => {
//   const flatTeachers = classrooms.reduce((all, classroom) => {
//     return all.concat(classroom.teachers);
//   }, []);
//   console.log("flatTeachers = ", flatTeachers);
//   const uniqueTeachers = new Set(flatTeachers);
//   console.log("uniqueTeachers = ", uniqueTeachers);
//   dispatch(startRequest());
//   //TODO: HANDLE ERRORS BETTER
//   try {
//     // console.log("teachers = ", [...uniqueTeachers.values()]);
//     const promiseOfRewards = [...uniqueTeachers.values()].map(teacher => {
//       console.log("teacher = ", teacher);
//       return fetch(`/api/teachers/${teacher._id}/rewards`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: null
//       });
//     });
//     let allResponses = await Promise.all(promiseOfRewards);
//     console.log("responses = ", allResponses);
//     allResponses = allResponses.map(response => response.json());
//     let allRewards = await Promise.all(allResponses);
//     console.log("all rewards = ", allRewards);
//     allRewards = allRewards.map(response => response.apiData);
//     console.log("all rewards = ", allRewards);
//     // dispatch(getRewards(allRewards));
//   } catch (e) {
//     console.error(e);
//     dispatch(failedRequest(e));
//   }
// };
