import React, { useContext } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link, useNavigate } from 'react-router-dom';
import  UserContext  from '../contexts/UserContext';

function MenuPage() {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed sm:top-0 sm:left-0 sm:h-full sm:w-64 sm:flex sm:flex-col p-4 bg-gray-100 shadow-lg 
                    bottom-0 w-full flex justify-around sm:justify-start sm:space-y-6">
      <h1 className="text-2xl font-semibold mb-6 text-center sm:block hidden text-gray-800">Menu</h1>
      <nav className="flex sm:flex-col justify-around w-full sm:w-auto">
        <Link 
          to="/homepage" 
          className="flex flex-col sm:flex-row items-center text-gray-700 hover:text-blue-600 transition duration-200 p-3 rounded-lg 
                    hover:bg-gray-200">
          <HomeIcon className="mr-0 sm:mr-2 text-gray-600" /> 
          <span className="sm:inline hidden text-gray-800">Home</span>
        </Link>
        <Link 
          to="/search" 
          className="flex flex-col sm:flex-row items-center text-gray-700 hover:text-blue-600 transition duration-200 p-3 rounded-lg 
                    hover:bg-gray-200">
          <SearchIcon className="mr-0 sm:mr-2 text-gray-600" /> 
          <span className="sm:inline hidden text-gray-800">Search</span>
        </Link>
        <Link 
          to="/messages" 
          className="flex flex-col sm:flex-row items-center text-gray-700 hover:text-blue-600 transition duration-200 p-3 rounded-lg 
                    hover:bg-gray-200">
          <MessageIcon className="mr-0 sm:mr-2 text-gray-600" /> 
          <span className="sm:inline hidden text-gray-800">Messages</span>
        </Link>
        {/*<Link 
          to="/notifications" 
          className="flex flex-col sm:flex-row items-center text-gray-700 hover:text-blue-600 transition duration-200 p-3 rounded-lg 
                    hover:bg-gray-200">
          <NotificationsIcon className="mr-0 sm:mr-2 text-gray-600" /> 
          <span className="sm:inline hidden text-gray-800">Notifications</span>
        </Link>*/}
        <Link 
          to="/createpost" 
          className="flex flex-col sm:flex-row items-center text-gray-700 hover:text-blue-600 transition duration-200 p-3 rounded-lg 
                    hover:bg-gray-200">
          <AddBoxIcon className="mr-0 sm:mr-2 text-gray-600" /> 
          <span className="sm:inline hidden text-gray-800">Create Post</span>
        </Link>
        <Link 
          to="/profile" 
          className="flex flex-col sm:flex-row items-center text-gray-700 hover:text-blue-600 transition duration-200 p-3 rounded-lg 
                    hover:bg-gray-200">
          <AccountBoxIcon className="mr-0 sm:mr-2 text-gray-600" /> 
          <span className="sm:inline hidden text-gray-800">Profile</span>
        </Link>
        <Link 
          to="/newspage" 
          className="flex flex-col sm:flex-row items-center text-gray-700 hover:text-blue-600 transition duration-200 p-3 rounded-lg 
                    hover:bg-gray-200">
          <NotificationsIcon className="mr-0 sm:mr-2 text-gray-600" /> 
          <span className="sm:inline hidden text-gray-800">News Page</span>
        </Link>
        <button 
          onClick={handleLogout} 
          className="flex flex-col sm:flex-row items-center text-gray-700 hover:text-blue-600 transition duration-200 p-3 rounded-lg 
                    hover:bg-gray-200">
          <SettingsIcon className="mr-0 sm:mr-2 text-gray-600" /> 
          <span className="sm:inline hidden text-gray-800">Logout</span>
        </button>
      </nav>
    </div>
  );
}

export default MenuPage;
