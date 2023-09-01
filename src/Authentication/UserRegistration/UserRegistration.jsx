import React, { useState, useEffect } from "react";
import { get, post } from "../../ApiUtils/ApiUtils";
import "./UserRegistration.css";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Webcam from "react-webcam";

const UserRegistration = () => {
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
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [error, setError] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [cameraImage, setCameraImage] = useState(null);
  const webcamRef = React.useRef(null);

  useEffect(() => {
    // Fetch data from the API using the get function
    get("/getDepartment")
      .then((response) => {
        setDepartmentOptions(response.data);
      })
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
      !formData.confirmPassword ||
      !department
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
      setError('')
      handleUserRegister();
    }
  };

  const handleUserRegister = () => {
    const postData = {
      // Your data to be sent in the request
      firstName: formData.firstName,
      lastName: formData.lastName,
      userName: formData.userName,
      userImage: cameraImage,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      dob: formData.dob,
      gender: formData.gender,
      department: department,
      role: selectedRoles,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      // Other optional configurations can be included here (e.g., timeout, auth tokens)
    };

    // Make a POST request using the post function
    post("/saveUserDetails", postData, config)
      .then((response) => {
        console.log("User Register Successful : ", response);
      })
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

  const handleRoleChange = (event) => {
    const roleName = event.target.name;

    if (event.target.checked) {
      setSelectedRoles((prevSelectedRoles) => [...prevSelectedRoles, roleName]);
    } else {
      setSelectedRoles((prevSelectedRoles) =>
        prevSelectedRoles.filter((role) => role !== roleName)
      );
    }
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

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
                      onClick={() => setCameraImage(null)}
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
                type="date"
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
            <div className="form-group my-3">
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRoles.includes("teacher")}
                      onChange={handleRoleChange}
                      name="teacher"
                    />
                  }
                  label="Teacher"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRoles.includes("principal")}
                      onChange={handleRoleChange}
                      name="principal"
                    />
                  }
                  label="Principal"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRoles.includes("student")}
                      onChange={handleRoleChange}
                      name="student"
                    />
                  }
                  label="Student"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRoles.includes("watchman")}
                      onChange={handleRoleChange}
                      name="watchman"
                    />
                  }
                  label="Watchman"
                />
              </div>
            </div>
            <div className="form-group my-3">
              <FormControl variant="outlined" className="department">
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  value={department}
                  onChange={handleDepartmentChange}
                  fullWidth
                >
                  {departmentOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <Button
              className="mt-1"
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

export default UserRegistration;
