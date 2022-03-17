import { useEffect } from "react";
import { connect } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

// GitHub API
const gitHubApi = (username) => {
  return fetch(`https://api.github.com/users/${username}`)
    .then((response) => {
      return response.json().then(({ login, avatar_url, html_url }) => ({
        login,
        avatar_url,
        html_url,
      }));
    })
    .catch((error) => {
      throw error;
    });
};

// Action
const getUserDetails = (payload) => {
  return {
    type: "LOAD_USER_REQUEST",
    payload,
  };
};

// Reducer
const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_USER_SUCCESS":
      return action.user;
    default:
      return state;
  }
};

// Sagas
function* loadUserDetails({ payload }) {
  try {
    const user = yield call(gitHubApi, payload); // Make Api call to Github api with the username
    yield put({ type: "LOAD_USER_SUCCESS", user }); // Yields effect to the reducer specifying the action type and optional parameter
  } catch (error) {
    throw error;
  }
}

// Watches for LOAD_USER_REQUEST action and call loadUserDetails with supplied arguments
function* watchRequest() {
  yield takeLatest("LOAD_USER_REQUEST", loadUserDetails);
}

const GetUserProfile = ({ user, getUserDetails }) => {
  const handleUserDetail = (e) => {
    getUserDetails(e.target.value);
  };

  useEffect(() => {
    getUserDetails("bashar3w");
  }, [getUserDetails]);

  return (
    <div className="wrapper">
      <div className="inner_part">
        <input
          type="text"
          name="username"
          placeholder="Enter your github username"
          onChange={handleUserDetail}
        />
        <div className="user_info">
          <h1> User Profile </h1>
          {user ? (
            <div className="user_details">
              <img src={user.avatar_url} alt="user_pic" width="100%" />
              <div className="user_name">
                <a href={user.html_url} rel="noreferrer" target="_blank">
                  {user.login}
                </a>
              </div>
            </div>
          ) : (
            <h3 className="not_found">Loading...</h3>
          )}
        </div>
      </div>
    </div>
  );
};

// Setup store
const sagaMiddleware = createSagaMiddleware();
const store = createStore(userReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(watchRequest);

const mapStateToProps = (state) => ({ user: state }); // Map the store's state to component's props

const mapDispatchToProps = (dispatch) => ({
  getUserDetails: (username) => dispatch(getUserDetails(username)),
}); // wrap action creator with dispatch method
const UserProfilePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(GetUserProfile);

export { store, UserProfilePage };

