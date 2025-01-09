import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const setUserFromToken = async (token) => {
    try {
      console.log(loggedInUser)
      const response = await axios.get('https://social-media-app-kamd.onrender.com/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoggedInUser(response.data);
    } catch (err) {
      console.log('Error finding loggedInUser', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); 
    setLoggedInUser(null); 
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserFromToken(token);
    }else{
      setLoggedInUser(null);
    }
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser: setUserFromToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
