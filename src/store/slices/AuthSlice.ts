import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios, { CustomAxiosError } from "axios";

export const API_URL = "http://localhost:5000";

interface Signup {
  fullName?: string;
  email: string;
  password: string;
}

export const resetAuthState = createAction("user/resetAuthState");

export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (
    {
      payload,
      callback,
    }: { payload: Signup; callback: (msg: string, status: string) => void },
    { dispatch }
  ) => {
    try {
      dispatch(signUpRequest());
      const response = await axios.post(`${API_URL}/user/signup`, payload);
      console.log(response);
      if (response.status === 200) {
        dispatch(signUpSuccess(response.data.user));
        localStorage.setItem("dented-token", response.data.token);
        callback("User Registered Successfully!!", "success");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const axiosErr = error as CustomAxiosError;
      dispatch(signUpFail(axiosErr.response.data.message));
      callback(axiosErr.response.data.message, "error");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    {
      payload,
      callback,
    }: { payload: Signup; callback: (msg: string, status: string) => void },
    { dispatch }
  ) => {
    try {
      dispatch(signUpRequest());
      const response = await axios.post(`${API_URL}/user/login`, payload);
      if (response.status === 200) {
        dispatch(
          signUpSuccess({
            userDetails: response.data.user,
            token: response.data.token,
          })
        );
        localStorage.setItem("dented-token", response.data.token);
        callback("User LoggedIn Successfully", "success");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const axiosErr = error as CustomAxiosError;
      dispatch(signUpFail(axiosErr.response.data.message));
      dispatch(signUpFail(axiosErr.response.data.message));
      callback(axiosErr.response.data.message, "error");
    }
  }
);
interface UserDetails {
  email: string;
  name: string;
}
interface AppState {
  loading: boolean;
  userDetails: UserDetails | null;
  token: string | null;
  error: string | null;
}
const initialState: AppState = {
  loading: false,
  userDetails: null,
  token: null,
  error: null,
};

export const AuthSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signUpRequest: (state) => {
      state.loading = true;
    },
    signUpSuccess: (state, action) => {
      state.loading = false;
      state.userDetails = action.payload.userDetails;
      state.token = action.payload.token;
      state.error = null;
    },
    signUpFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.userDetails = null;
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.userDetails = null;
      state.error = null;
    },
  },
});

export const { signUpRequest, signUpSuccess, signUpFail } = AuthSlice.actions;

export default AuthSlice.reducer;
