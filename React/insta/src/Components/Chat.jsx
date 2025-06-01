import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io.connect('https://social-media-app-kamd.onrender.com', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log("Connected to server");
});

const Chat = () => {
  const { userName: receiverUserName } = useParams();
  const { loggedInUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log(loggedInUser);
        const response = await axios.get(`https://social-media-app-kamd.onrender.com/conversations/${loggedInUser.userName}/${receiverUserName}`);
        setMessages(response.data);
      } catch (error) {
        console.log('Error fetching messages: ', error);
      }
    };
    fetchMessages();
  }, [loggedInUser.userName, receiverUserName]);

  useEffect(() => {
    socket.emit('user_connected', loggedInUser.userName);
  }, [loggedInUser.userName]);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socket.off('receive_message');
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      sender: loggedInUser.userName,
      receiver: receiverUserName,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit('send_message', message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
  };

  const messagesByDate = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-screen bg-[#1E1E2C] text-gray-100">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between p-4 bg-[#252537] text-white border-b border-gray-700 shadow">
        <button
  onClick={() => navigate(-1)}
  className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 z-20"
>
  ← Back
</button>
        <h2 className="text-lg font-semibold">{receiverUserName}</h2>
        <div className="w-16">{/* Empty space to balance layout */}</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(messagesByDate).map((date, index) => (
          <div key={index}>
            <div className="text-center text-gray-500 mb-2">{date}</div>
            {messagesByDate[date].map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.sender === loggedInUser.userName ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg shadow-lg ${
                    message.sender === loggedInUser.userName
                      ? 'bg-[#4B8FED] text-white rounded-br-none'
                      : 'bg-[#333344] text-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-xs text-gray-300 mb-1">
                    {message.sender === loggedInUser.userName ? 'You' : receiverUserName}
                  </p>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-[#252537] border-t border-gray-700 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 bg-[#333344] text-white border border-gray-600 rounded-full focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-[#4B8FED] text-white rounded-full hover:bg-[#357ABD] transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
