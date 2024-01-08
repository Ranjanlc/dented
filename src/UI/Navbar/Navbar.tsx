import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../store/Store";
import { AppDispatch } from "../../pages/Auth/Signup/Signup";
import { resetAuthState } from "../../store/slices/AuthSlice";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const { userDetails, loading } = useSelector(
    (state: IRootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    localStorage.removeItem("dented-token");
    toast.success("Logged out successfully");
    dispatch(resetAuthState());
  };
  return (
    <header className={styles.header}>
      <h1
        onClick={() => {
          navigate("/");
        }}
      >
        React Login
      </h1>
      <nav className={styles.actions}>
        {!userDetails && !loading ? (
          <>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/login"
            >
              Login
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/signup"
            >
              Signup
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              to="/profile"
            >
              Profile
            </NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}
