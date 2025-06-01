import React, { Component } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Link, Navigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

class LoginPage extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      showModal: false,
      modalMessage: '',
      redirectToHome: false,
      loading: false, // New loading state
    };
  }

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://social-media-app-kamd.onrender.com/api/login', this.state);
      const data = response.data;
      if (data.user) {
        this.setState({
          showModal: true,
          modalMessage: 'Login successful! Welcome back.',
          loading: true, // Start loading here
        });
        localStorage.setItem('token', data.user);

        const { setLoggedInUser } = this.context;
        setLoggedInUser(data.user);

        setTimeout(() => {
          this.setState({ redirectToHome: true });
        }, 3000);
      } else {
        this.setState({
          showModal: true,
          modalMessage: 'Incorrect username or password. Please try again.',
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        showModal: true,
        modalMessage: 'Login failed. Please try again later.',
        loading: false,
      });
    }
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  renderModal() {
    const { showModal, modalMessage } = this.state;

    if (!showModal) return null;

    return (
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mt-4">
          <h2 className="text-2xl font-bold text-center mb-4">Alert</h2>
          <p className="text-center text-gray-700 mb-6">{modalMessage}</p>
          <div className="text-center">
            <button
              onClick={this.closeModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { userName, password, redirectToHome, loading } = this.state;

    if (redirectToHome) {
      return <Navigate to="/homepage" />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-green-100 flex flex-col justify-center items-center">
        {this.renderModal()}

        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6 relative">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Login</h1>

          {/* Show loading message or spinner */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
              <div className="text-blue-600 text-xl font-semibold">Logging in... Please wait.</div>
            </div>
          )}

          <form onSubmit={this.submitHandler} className={`${loading ? 'opacity-50 pointer-events-none' : ''} space-y-4`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="userName"
                value={userName}
                onChange={this.changeHandler}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={this.changeHandler}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">Don't have an account?</p>
            <Button
              variant="text"
              startIcon={<AccountBoxIcon />}
              component={Link}
              to="/Signup"
              className="text-blue-600 hover:text-blue-800 transition ease-in-out duration-150"
              disabled={loading}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
