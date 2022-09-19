import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import "./login.css";
import { LogginUser, login } from "../../features/auth/authSlice";
import { AppDispatch } from "../../app/store";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const onLogin = (e: any) => {
    e.preventDefault();

    if (username === "") {
      return toast("Please fill in username field");
    }
    if (password === "") {
      return toast("Please fill in password field");
    }

    const user: LogginUser = {
      username,
      password,
    };

    dispatch(login(user));
  };

  return (
    <>
      <ToastContainer />

      <form className="Login_LoginForm" onSubmit={(e) => onLogin(e)}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
