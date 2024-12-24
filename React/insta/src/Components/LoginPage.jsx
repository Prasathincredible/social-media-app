import React, { Component, useContext } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Link, Navigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

class LoginPage extends Component {

  static contextType=UserContext

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      showModal: false, // To control modal visibility
      modalMessage: '',
      redirectToHome: false, // Add state to track redirection
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
          showModal: true, // Show the modal on success
          modalMessage: 'Login successful! Welcome back.',
        });
        localStorage.setItem('token', data.user);

        const {setLoggedInUser}=this.context

        setLoggedInUser(data.user);

        setTimeout(() => {
          this.setState({ redirectToHome: true }); // Set state to redirect after success
        }, 3000); // Wait for 3 seconds before redirecting
      } else {
        this.setState({
          showModal: true,
          modalMessage: 'Incorrect username or password. Please try again.',
        });
      }
    } catch (error) {
      this.setState({
        showModal: true,
        modalMessage: 'Login failed. Please try again later.',
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
    const { userName, password, redirectToHome } = this.state;

    if (redirectToHome) {
      return <Navigate to="/homepage" />; // Use Navigate to redirect to homepage
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-green-100 flex flex-col justify-center items-center">
        {this.renderModal()}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Login</h1>
          <form onSubmit={this.submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="userName"
                value={userName}
                onChange={this.changeHandler}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
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
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
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