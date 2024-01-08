import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./UI/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/Signup/Signup";
import Home from "./pages/Home/Home";
import { useSelector } from "react-redux";
import { IRootState } from "./store/Store";
import Profile from "./pages/Profile/Profile";

export default function App() {
  const { userDetails, error } = useSelector((state: IRootState) => state.auth);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={!userDetails ? <Login /> : <Navigate to="/profile" />}
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
