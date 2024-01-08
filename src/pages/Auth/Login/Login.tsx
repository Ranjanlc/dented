import { FC, FormEvent, useRef, useState } from "react";
import styles from "../Signup/Auth.module.css";
import {
  AiFillEye,
  AiFillEyeInvisible,
  // AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../store/slices/AuthSlice";
import { AppDispatch } from "../Signup/Signup";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { CustomAxiosError } from "axios";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [active, setActive] = useState(true);
  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!emailRef.current || !pwRef.current) {
      return toast.error("Please fill all the fields");
    }
    const data = {
      email: emailRef.current.value,
      password: pwRef.current.value,
    };
    dispatch(
      loginUser({
        payload: data,
        callback: (msg, status) => {
          if (status === "error") {
            return toast.error(msg);
          }
          toast.success(msg);
          navigate("/profile");
        },
      })
    );
  };
  // const handleFormSubmit = (e: FormEvent) => {
  //   e.preventDefault();
  //   const data = {
  //     email: emailRef.current?.value ?? "",
  //     password: pwRef.current?.value ?? "",
  //     rememberMe: true,
  //   };
  //   mutate(data, {
  //     onSuccess: ({ token }) => {
  //       queryClient.invalidateQueries({ queryKey: ["userDetails"] });
  //       localStorage.setItem("wedding-token", token);
  //       toast.success("Logged in successfully");
  //       router.push("/");
  //     },
  //     onError: (error) => {
  //       const axioserror = error as CustomAxiosError;
  //       const { message } = axioserror.response?.data;
  //       console.log(message);
  //       toast.error(message);
  //     },
  //   });
  // };
  const Backdrop: FC<{ onClick: () => void }> = ({ onClick }) => {
    return <div className={styles.backdrop} onClick={onClick} />;
  };

  return (
    <>
      {/* <main className={styles.container}>
        <img src="/images/auth/bg-1.jpg" alt="hello" width={720} height={512} />
        <img src="/images/auth/bg-2.jpg" alt="hello" width={720} height={512} />
        <img src="/images/auth/bg-3.jpg" alt="hello" width={720} height={512} />
        <img src="/images/auth/bg-4.jpg" alt="hello" width={720} height={512} />
      </main> */}
      {createPortal(
        <Backdrop
          onClick={() => {
            navigate("/");
          }}
        />,
        document.getElementById("backdrop") as HTMLElement
      )}
      <section
        className={`${!active ? styles.remove : ""} ${styles.auth}`}
        onClick={() => {
          setActive(false);
        }}
      >
        <header className={styles.header}>
          <h1>Login</h1>
        </header>
        <form className={styles["input-container"]} onSubmit={handleFormSubmit}>
          <section className={styles.inputs}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              ref={emailRef}
              required
              placeholder="Enter your email"
            />
          </section>
          <section className={`${styles.password} ${styles.inputs}`}>
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter password"
              ref={pwRef}
            />
            {showPassword ? (
              <AiFillEye
                onClick={() => {
                  setShowPassword(false);
                }}
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => {
                  setShowPassword(true);
                }}
              />
            )}
          </section>

          <button type="submit" className={styles.login}>
            {/* {!isLoading ? " Log In" : <AiOutlineLoading3Quarters />} */}
            Log In
          </button>
        </form>
        <span className={styles.signup}>
          {" "}
          Don&apos;t have an account? <Link to="/signup"> Signup</Link>
        </span>
      </section>
    </>
  );
}
