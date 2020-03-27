import axios from "axios";
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../utills/setAuthToken";

const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("/api/auth");
    console.log(res.data);
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      dispatch({
        type: AUTH_ERROR
      });
    }
  }
};

export const login = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = await JSON.stringify({ email, password });
  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    if (err) {
      console.error(err);
    }
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};

export default loadUser;
