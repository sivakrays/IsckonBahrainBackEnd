import React, { useState } from "react";
import { post } from "../../ApiUtils/ApiUtils";
import { TextField, Button } from "@mui/material";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleValidation = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (username === "" || password === "") {
      setError("Enter username and password");
    } else if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
      setError("Invalid username or password");
    } else {
      setError("");
      handleLogin();
    }
  };

  const handleLogin = () => {
    const postData = {
      email: username,
      password: password,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    post("/login", postData, config).then((response) => {
      console.log("Login Successful : ", response);
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">LOGIN</h3>
          <form>
            <div className="form-group">
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
            </div>
            <div className="form-group my-3">
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleValidation}
              fullWidth
            >
              Login
            </Button>
            <p className="text-start text-primary mt-3">Forgot Password?</p>
            {error && (
              <p className="text-danger text-center" style={{ fontSize: 14 }}>
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
