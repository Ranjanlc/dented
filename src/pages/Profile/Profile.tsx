import React, { FC, FormEvent, useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../store/Store";
import { AppDispatch } from "../Auth/Signup/Signup";
import {
  initializeAuth,
  refreshAccessToken,
  updateUser,
} from "../../store/slices/TokenSlice";
import { resetAuthState } from "../../store/slices/AuthSlice";

const Profile: FC = () => {
  const { userDetails, loading, error } = useSelector(
    (state: IRootState) => state.token
  );
  console.log(userDetails);
  const dispatch = useDispatch<AppDispatch>();
  const [userInputDetails, setuserInputDetails] = useState({
    name: "",
    email: "",
  });
  useEffect(() => {
    !userDetails && !loading && dispatch(initializeAuth());
    !userDetails && !loading && error && dispatch(resetAuthState());
  }, [dispatch, userDetails, loading, error]);

  useEffect(() => {
    setuserInputDetails({
      name: userDetails?.name || "",
      email: userDetails?.email || "",
    });
  }, [userDetails]);

  useEffect(() => {
    const tokenRefreshInterval = setInterval(() => {
      const storedToken = localStorage.getItem("dented-token");

      if (storedToken) {
        dispatch(refreshAccessToken());
      }
    }, 14 * 60 * 1000); // 15 minutes

    return () => clearInterval(tokenRefreshInterval);
  }, [dispatch]);
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setuserInputDetails({ ...userInputDetails, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(
      updateUser({
        payload: {
          fullName: userInputDetails.name,
          email: userInputDetails.email,
        },
        callback: (message, status) => {
          if (status === "error") {
            return toast.error(message);
          }
          toast.success(message);
        },
      })
    );
  };

  return (
    <form className={styles.editProfile} onSubmit={handleSubmit}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.lower}>
            <div className={styles.row}>
              <div className={styles.inputs}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  value={userInputDetails?.name}
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className={styles.otherDetails}>
              <div className={styles.row}>
                <div className={styles.inputs}>
                  <label htmlFor="email">Email</label>
                  <input
                    value={userInputDetails?.email}
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className={`${styles.upload} ${styles.button}`}
              disabled={loading}
            >
              {!loading ? "Edit" : <AiOutlineLoading3Quarters />}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Profile;
