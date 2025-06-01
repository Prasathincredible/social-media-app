import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import MenuPage from './MenuPage';
import { Button } from '@mui/material';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`https://social-media-app-kamd.onrender.com/conversations/convos`, {
          params: { user: loggedInUser.userName },
        });
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, [loggedInUser]);

  const handleConversationClick = (otherUser) => {
    navigate(`/chat/${otherUser}`);
  };

  const goBack = () => {
    navigate(-1); // Go to previous page
  };

  return (
    <div className="flex flex-col items-center py-6">
      <MenuPage />

      {/* Back Button */}
      <div className="mb-4 self-start ml-6">
        <button
  onClick={() => navigate(-1)}
  className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 z-20"
>
  ← Back
</button>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Conversations</h1>

      <ul className="w-full max-w-md">
        {conversations.map((conversation) => {
          const otherUser = conversation.sender === loggedInUser.userName ? conversation.receiver : conversation.sender;
          return (
            <li
              key={conversation._id}
              onClick={() => handleConversationClick(otherUser)}
              className="flex items-center p-4 mb-2 bg-white shadow rounded-lg hover:bg-gray-100 cursor-pointer transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold mr-3">
                {otherUser.charAt(0).toUpperCase()}
              </div>
              <div className="text-lg font-medium text-gray-800">{otherUser}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Messages;
