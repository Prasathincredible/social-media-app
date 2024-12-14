import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ButtonBase } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuPage from './MenuPage';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('https://social-media-app-kamd.onrender.com/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.log('Error fetching users', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-wrap justify-center p-4">
      <MenuPage/>
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-white shadow-md rounded-lg m-4 p-4 flex flex-col items-center transition-transform transform hover:scale-105"
        >
          <ButtonBase component={Link} to={`/users/${user.userName}`} className="mb-2">
            <img
              src={user.avatar}
              alt={user.userName}
              className="w-20 h-20 rounded-full border-2 border-gray-300"
            />
          </ButtonBase>
          <b className="text-lg text-gray-800">{user.userName}</b>
        </div>
      ))}
    </div>
  );
}

export default UserList;
