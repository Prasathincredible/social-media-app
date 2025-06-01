import React, { Component } from 'react';
import axios from 'axios';
import { TextField, InputAdornment, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FaceIcon from '@mui/icons-material/Face';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      fullName: '',
      userName: '',
      bio: '',
      password: '',
      avatar: null,
      showAlert: false, // Alert visibility state
      alertMessage: '',
      alertType: 'success', // success, error
      loading: false, // New loading state
    };
  }

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleFileChange = (e) => {
    this.setState({
      avatar: e.target.files[0],
    });
  };

  submitHandler = async (e) => {
    e.preventDefault();

    this.setState({ loading: true }); // Start loading

    const formData = new FormData();
    formData.append('email', this.state.email);
    formData.append('fullName', this.state.fullName);
    formData.append('userName', this.state.userName);
    formData.append('bio', this.state.bio);
    formData.append('password', this.state.password);
    formData.append('avatar', this.state.avatar);

    try {
      const response = await axios.post('https://social-media-app-kamd.onrender.com/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.data;

      if (data.status === 'ok') {
        this.setState({
          showAlert: true,
          alertMessage: 'Account created successfully!',
          alertType: 'success',
          loading: false,
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      this.setState({
        showAlert: true,
        alertMessage: 'Something went wrong. Please try again!',
        alertType: 'error',
        loading: false,
      });
    }
  };

  closeAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  renderAlert() {
    const { showAlert, alertMessage, alertType } = this.state;

    if (!showAlert) return null;

    const alertStyles = {
      success: 'bg-green-100 text-green-700',
      error: 'bg-red-100 text-red-700',
    };

    const iconStyles = {
      success: <CheckCircleIcon className="text-green-600" />,
      error: <CheckCircleIcon className="text-red-600" />,
    };

    return (
      <div
        className={`fixed top-5 right-5 z-50 max-w-sm w-full shadow-lg rounded-lg p-4 flex items-center space-x-3 ${alertStyles[alertType]}`}
      >
        <div className="flex-shrink-0">{iconStyles[alertType]}</div>
        <div className="flex-1">
          <p className="font-semibold">{alertMessage}</p>
        </div>
        <button onClick={this.closeAlert} className="text-gray-500 hover:text-gray-700">
          <CloseIcon />
        </button>
      </div>
    );
  }

  render() {
    const { email, fullName, userName, bio, password, loading } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-green-100 flex flex-col justify-center items-center">
        {/* Render Alert */}
        {this.renderAlert()}

        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6 relative">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Sign Up</h1>

          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col justify-center items-center z-10 rounded-lg">
              <CircularProgress color="primary" />
              <p className="mt-4 text-blue-600 font-semibold">Creating account, please wait...</p>
            </div>
          )}

          <form onSubmit={this.submitHandler} className={`${loading ? 'opacity-50 pointer-events-none' : ''} space-y-4`}>
            {/* Email Input */}
            <TextField
              name="email"
              value={email}
              onChange={this.changeHandler}
              fullWidth
              placeholder="Email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Full Name Input */}
            <TextField
              name="fullName"
              value={fullName}
              onChange={this.changeHandler}
              fullWidth
              placeholder="Full Name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
                  </InputAdornment>
                ),
              }}
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Username Input */}
            <TextField
              name="userName"
              value={userName}
              onChange={this.changeHandler}
              fullWidth
              placeholder="Username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaceIcon />
                  </InputAdornment>
                ),
              }}
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Bio Input */}
            <textarea
              name="bio"
              value={bio}
              onChange={this.changeHandler}
              placeholder="Bio"
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            {/* Avatar Upload */}
            <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-300">
              <input
                type="file"
                name="avatar"
                onChange={this.handleFileChange}
                className="block w-full text-sm text-gray-500 cursor-pointer focus:outline-none"
                disabled={loading}
              />
            </div>
            {/* Password Input */}
            <TextField
              name="password"
              value={password}
              onChange={this.changeHandler}
              fullWidth
              type="password"
              placeholder="Password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default SignUp;
