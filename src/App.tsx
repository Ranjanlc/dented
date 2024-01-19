import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./UI/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/Signup/Signup";
import { useSelector } from "react-redux";
import { IRootState } from "./store/Store";
import Profile from "./pages/Profile/Profile";

export default function App() {
  const { userDetails, error, loading } = useSelector(
    (state: IRootState) => state.token
  );
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            userDetails && !error && !loading ? (
              <Navigate to="/profile" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={
            !userDetails && error && !loading ? (
              <Login />
            ) : (
              <Navigate to="/profile" />
            )
          }
        />
        <Route
          path="/signup"
          element={!userDetails ? <Signup /> : <Navigate to="/profile" />}
        />

        <Route
          path="/profile"
          element={
            !userDetails && error ? <Navigate to="/login" /> : <Profile />
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}
