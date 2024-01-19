import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { CustomAxiosError } from "axios";
import { API_URL } from "./AuthSlice";

interface Update {
  fullName: string;
  email: string;
}

export const initializeAuth = createAsyncThunk(
  "user/initializeAuth",
  async (_, { dispatch }) => {
    try {
      // Assuming you have an API endpoint to fetch user details based on the token
      dispatch(signUpRequest());
      const token = localStorage.getItem("dented-token");
      const response = await axios.get(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        console.log(response.data.user);
        dispatch(authorizationSuccess(response.data.user));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const axiosErr = error as CustomAxiosError;
      dispatch(signUpFail(axiosErr.response.data.message));
    }
  }
);
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (
    {
      payload,
      callback,
    }: { payload: Update; callback: (msg: string, status: string) => void },
    { dispatch }
  ) => {
    try {
      dispatch(signUpRequest());
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("dented-token")}`,
      };
      const response = await axios.put(`${API_URL}/user`, payload, { headers });
      if (response.status === 200) {
        dispatch(
          signUpSuccess({
            userDetails: response.data.user as UserDetails,
            token: response.data.token,
          })
        );
        localStorage.setItem("dented-token", response.data.token);
        callback("User Updated Successfully", "success");
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
export const refreshAccessToken = createAsyncThunk(
  "user/refresh",
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_URL}/user/refresh-token`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("dented-token")}`,
        },
      });

      const { data } = response;

      if (response.status === 200) {
        // Update the stored token with the new one
        localStorage.setItem("dented-token", data.token);
      }
    } catch (error) {
      const axiosErr = error as CustomAxiosError;
      dispatch(signUpFail(axiosErr.response.data.message));
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

export const TokenSlice = createSlice({
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
    changePWSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    signUpFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.userDetails = null;
    },
    authorizationSuccess: (state, action) => {
      state.loading = false;
      state.userDetails = action.payload;
      state.error = null;
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.userDetails = null;
      state.error = null;
    },
  },
});

export const {
  signUpRequest,
  signUpSuccess,
  signUpFail,
  authorizationSuccess,
  changePWSuccess,
} = TokenSlice.actions;

export default TokenSlice.reducer;
