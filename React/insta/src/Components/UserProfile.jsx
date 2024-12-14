import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MenuPage from './MenuPage';
import CommentsModal from './CommentsModal';
import UserListModal from './UserListModal';

const UserProfile = () => {
  const { loggedInUser } = useContext(UserContext);
  const { userName } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [userListType, setUserListType] = useState('');
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [userName]);



  const fetchProfile = async () => {
    try {
      const response = await axios.get(`https://social-media-app-kamd.onrender.com/users/${userName}`);
      setProfile(response.data);
      setIsFollowing(loggedInUser?.following.includes(response.data.userName));
    } catch (error) {
      console.log('Error fetching user profile', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userName]);
  

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`https://social-media-app-kamd.onrender.com/users/${userName}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.log('Error fetching user posts', error);
    }
  };

  const fetchUserList = async (type) => {
    try {
      const endpoint = `https://social-media-app-kamd.onrender.com/profile/${type}`;
      const response = await axios.get(endpoint, {
        params: { askedUser: profile.userName },
      });
      setUserList(response.data[type]);
      setUserListType(type);
      setShowUserListModal(true);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const followUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://social-media-app-kamd.onrender.com/follow',
        { followId: profile.userName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(true);
      fetchProfile();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const unfollowUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://social-media-app-kamd.onrender.com/unfollow',
        { unfollowId: profile.userName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const openCommentsModal = (post) => {
    setSelectedPost(post);
  };

  const closeCommentsModal = () => {
    setSelectedPost(null);
  };

  const startChat = async () => {
    const sender = loggedInUser.userName;
    const receiver = profile.userName;
    try {
      const response = await axios.get('https://social-media-app-kamd.onrender.com/conversations', {
        params: { sender, receiver },
      });
      if (response.data.length > 0) {
        navigate(`/chat/${receiver}`);
      } else {
        await axios.post('https://social-media-app-kamd.onrender.com/conversations', {
          sender,
          receiver,
          lastMessage: '',
          timestamp: new Date().toISOString(),
        });
        navigate(`/chat/${receiver}`);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const renderMedia = (mediaUrl) => {
    if (!mediaUrl) return null;
    const fileExtension = mediaUrl.split('.').pop().toLowerCase();
    
    if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
      return <img src={mediaUrl} alt="media" className="w-full h-64 object-cover hover:opacity-90 transition-opacity duration-300" />;
    }

    if (fileExtension === 'mp4' || fileExtension === 'webm') {
      return <video src={mediaUrl} className="w-full h-64 object-cover hover:opacity-90 transition-opacity duration-300" controls />;
    }

    if (fileExtension === 'mp3' || fileExtension === 'wav') {
      return <audio src={mediaUrl} className="w-full h-16 object-cover hover:opacity-90 transition-opacity duration-300" controls />;
    }

    return null;
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <MenuPage />
      <div className="flex flex-col items-center w-full p-4 bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
          {/* User Info Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={profile.avatar}
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
              alt="avatar"
            />
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-3xl font-semibold mb-1">{profile.userName}</h1>
              <p className="text-gray-700 mb-2">{profile.bio}</p>
              <div className="flex space-x-4 mb-4">
                <p className="text-gray-700">Posts: {posts.length}</p>
                <button
                  className="text-gray-700 underline"
                  onClick={() => fetchUserList('followers')}
                >
                  Followers: {profile.followers.length}
                </button>
                <button
                  className="text-gray-700 underline"
                  onClick={() => fetchUserList('following')}
                >
                  Following: {profile.following.length}
                </button>
              </div>

              {/* Follow/Unfollow Button */}
              <button
                onClick={isFollowing ? unfollowUser : followUser}
                className={`px-6 py-2 font-semibold text-white rounded-md focus:outline-none transition duration-200 ${
                  isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>

              {/* Chat Button */}
              <button
                onClick={startChat}
                className="mt-4 px-6 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md focus:outline-none"
              >
                Chat
              </button>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {posts.map((p) => (
              <div key={p._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                {renderMedia(p.image)} {/* Render media here */}
                <div className="p-4">
                  <p className="text-gray-800 font-semibold text-lg">{p.caption}</p>
                  <p className="text-sm text-gray-500 mt-2">Likes: {p.likes.length}</p>
                  <button
                    className="mt-4 w-full text-blue-500 hover:bg-blue-50"
                    onClick={() => openCommentsModal(p)}
                  >
                    View Comments
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedPost && (
        <CommentsModal post={selectedPost} onClose={closeCommentsModal} />
      )}
      {showUserListModal && (
        <UserListModal
          userList={userList}
          listType={userListType}
          onClose={() => setShowUserListModal(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
