import styles from "./Auth.module.css";
import { FC, FormEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "../../../store/slices/AuthSlice";
import { store } from "../../../store/Store";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";
// import { CustomAxiosError } from "axios";

type ShowPw = {
  index: number;
  show: boolean;
};
export type AppDispatch = typeof store.dispatch;

export default function Signup() {
  const [showPassword, setShowPassword] = useState<ShowPw>({
    index: 1,
    show: false,
  });
  const dispatch = useDispatch<AppDispatch>();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const confirmPwRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(true);
  const navigate = useNavigate();

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !confirmPwRef.current ||
      !pwRef.current ||
      !emailRef.current ||
      !nameRef.current ||
      confirmPwRef.current.value !== pwRef.current.value
    ) {
      return toast.error("Please enter valid values");
    }
    dispatch(
      signUpUser({
        payload: {
          email: emailRef.current.value,
          password: pwRef.current.value,
          fullName: nameRef.current.value,
        },
        callback: (message, status) => {
          if (status === "error") {
            return toast.error(message);
          }
          toast.success(message);
          navigate("/profile");
        },
      })
    );
  };
  const Backdrop: FC<{ onClick: () => void }> = ({ onClick }) => {
    return <> {<div className={styles.backdrop} onClick={onClick} />}</>;
  };

  // const handleFormSubmit = (e: FormEvent) => {
  //   e.preventDefault();
  //   if (pwRef.current?.value !== confirmPwRef.current?.value) {
  //     console.log("Password doesnot match");
  //     toast.error("Password doesnot match");
  //   } else {
  //     let data = {
  //       email: emailRef.current?.value ?? "",
  //       password: pwRef.current?.value ?? "",
  //       name: nameRef.current?.value ?? "",
  //     };
  //     console.log(data);
  //     mutate(data, {
  //       onSuccess: ({ token }) => {
  //         queryClient.invalidateQueries({ queryKey: ["userDetails"] });
  //         localStorage.setItem("wedding-token", token);
  //         toast.success("Signed up successfully");
  //         router.push("/");
  //       },
  //       onError: (error) => {
  //         const axioserror = error as CustomAxiosError;
  //         const { message } = axioserror.response?.data;
  //         toast.error(message);
  //       },
  //     });
  //   }
  // };
  return (
    <>
      <main>
        {/* <img src="/images/auth/bg-1.jpg" alt="hello" />
        <img src="/images/auth/bg-2.jpg" alt="hello" width={720} height={512} />
        <img src="/images/auth/bg-3.jpg" alt="hello" width={720} height={512} />
        <img src="/images/auth/bg-4.jpg" alt="hello" width={720} height={512} /> */}
        {createPortal(
          <Backdrop
            onClick={() => {
              navigate("/");
            }}
          />,
          document.getElementById("backdrop") as HTMLElement
        )}
      </main>
      <section
        className={`${!active ? styles.remove : ""}  ${styles.auth}`}
        onClick={() => {
          setActive(false);
        }}
      >
        <header className={styles.header}>
          <h1>Create Your Account</h1>
          <p className={styles.subscript}>Fill the fields up to get started</p>
        </header>
        <form onSubmit={handleFormSubmit} className={styles["input-container"]}>
          <section className={styles.inputs}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              ref={nameRef}
              required
              placeholder="Enter your full name"
            />
          </section>
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
              type={
                showPassword.index === 1 && showPassword.show
                  ? "text"
                  : "password"
              }
              ref={pwRef}
              required
              placeholder="Enter password"
            />
            {showPassword.index === 1 && showPassword.show ? (
              <AiFillEye
                onClick={() => {
                  setShowPassword({ index: 1, show: false });
                }}
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => {
                  setShowPassword({ index: 1, show: true });
                }}
              />
            )}
          </section>
          <section className={`${styles.password} ${styles.inputs}`}>
            <label htmlFor="pw">Confirm Password</label>
            <input
              type={
                showPassword.index === 2 && showPassword.show
                  ? "text"
                  : "password"
              }
              required
              ref={confirmPwRef}
              placeholder="Confirm your password"
            />
            {showPassword.index === 2 && showPassword.show ? (
              <AiFillEye
                onClick={() => {
                  setShowPassword({ index: 2, show: false });
                }}
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => {
                  setShowPassword({ index: 2, show: true });
                }}
              />
            )}
          </section>
          <button className={styles.login} type="submit">
            Sign Up
          </button>
        </form>
        <span className={styles.signup}>
          {" "}
          Already have an account? <Link to="/login"> Login</Link>
        </span>
      </section>
    </>
  );
}
