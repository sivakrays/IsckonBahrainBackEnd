import React, { useState, useEffect } from "react";
import "./DevotesRegistration.css";
import { post } from "../../ApiUtils/ApiUtils";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Webcam from "react-webcam";

const DevotesRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
  });
  const [cameraImage, setCameraImage] = useState(null);
  const webcamRef = React.useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch data from the API using the get function
    post("/endpoint")
      .then((response) => {
        console.log("Devotes Registration Success", response);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.userName ||
      !formData.email ||
      !formData.dob ||
      !formData.gender ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
    } else if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
    } else if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number"
      );
    } else if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
    } else if (!cameraImage) {
      setError("Please capture an image");
    } else {
      console.log("Details : ");
    }
  };

  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        setCameraImage(base64Image);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleCameraCapture = (e) => {
    e.preventDefault();
    const imageSrc = webcamRef.current.getScreenshot();
    setCameraImage(imageSrc);
  };

  const handleReCapture = (e) => {
    e.preventDefault();
    setCameraImage(null)
  }


  return (
    <div className="container d-flex justify-content-center align-items-center mt-5 mb-5">
      <div className="card p-4">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">REGISTER</h3>
          <form>
            <div className="form-group mt-3">
              <label>Upload Image:</label>
              <div className="mt-3 d-flex flex-column align-items-center">
                <div className="mb-3">
                  {cameraImage === null ? (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        width: 220,
                        height: 200,
                        facingMode: "user",
                      }}
                    />
                  ) : (
                    <img src={cameraImage} alt="Captured from Camera" />
                  )}
                </div>
                <div className="d-flex justify-content-center mb-1">
                  {cameraImage !== null ? (
                    <button
                      onClick={(e) => handleReCapture(e)}
                      className="btn btn-outline-primary mx-2"
                    >
                      Recapture
                    </button>
                  ) : (
                    <button
                      onClick={handleCameraCapture}
                      className="btn btn-primary mx-2"
                    >
                      Capture
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-control mx-2"
                  />
                </div>
              </div>
            </div>
            <div className="form-group mt-3">
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div className="form-group mt-3">
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div className="form-group mt-3">
              <TextField
                label="Username"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div className="form-group mt-3">
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div className="form-group mt-3">
              <TextField
                label="Date of Birth"
                name="dob"
                type='date'
                value={formData.dob}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0],
                }}
              />
            </div>
            <div className="form-group mt-3">
              <FormControl variant="outlined" className="department">
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-box"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="form-group mt-3">
              <TextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div className="form-group mt-3">
              <TextField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <Button
              className="mt-4"
              variant="contained"
              color="primary"
              onClick={handleRegister}
              fullWidth
            >
              SUBMIT
            </Button>
            {error && (
              <p
                className="text-danger text-center mt-3 error"
                style={{ fontSize: 14 }}
              >
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DevotesRegistration;
