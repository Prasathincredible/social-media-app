import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ButtonBase } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // ✅ import useNavigate
import MenuPage from './MenuPage';

function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // ✅ Initialize navigate

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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 relative">
      {/* Menu Page */}
      <div className="lg:w-1/4 w-full bg-white shadow-lg lg:static fixed bottom-0 left-0 z-10 lg:h-auto h-16">
        <MenuPage />
      </div>

      {/* User List */}
      <div className="lg:w-3/4 w-full p-6 lg:mt-0 mt-20 relative">
        {/* ✅ Back Button */}
        <button
  onClick={() => navigate(-1)}
  className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 z-20"
>
  ← Back
</button>


        <h2 className="text-2xl font-semibold mb-8 text-gray-700">User List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105"
            >
              <ButtonBase component={Link} to={`/users/${user.userName}`} className="mb-2">
                <img
                  src={user.avatar}
                  alt={user.userName}
                  className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
                />
              </ButtonBase>
              <b className="text-lg text-gray-800 truncate">{user.userName}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserList;
