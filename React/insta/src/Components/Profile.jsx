import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from 'react-router-dom';
import MenuPage from './MenuPage';
import CommentsModal from './CommentsModal';
import UserListModal from './UserListModal';
import UserContext from '../contexts/UserContext';

const Profile = () => {
  const { loggedInUser } = useContext(UserContext);
  const [post, setPost] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [listType, setListType] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://social-media-app-kamd.onrender.com/poster', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(response.data);
      } catch (err) {
        console.log('Error fetching posts', err);
      }
    };
    fetchPosts();
  }, []);

  const handleViewComments = (post) => {
    setSelectedPost(post);
    setIsCommentsModalOpen(true);
  };

  const handleOpenUserListModal = async (type) => {
    setListType(type);
    const endpoint = type === 'followers' ? 'followers' : 'following';
    try {
      const response = await axios.get(`https://social-media-app-kamd.onrender.com/profile/${endpoint}`, {
        params: { askedUser: loggedInUser.userName },
      });
      setUserList(response.data[type]);
      setIsUserListModalOpen(true);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  const handleCloseCommentsModal = () => {
    setIsCommentsModalOpen(false);
    setSelectedPost(null);
  };

  const handleCloseUserListModal = () => {
    setIsUserListModalOpen(false);
    setUserList([]);
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://social-media-app-kamd.onrender.com/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost((prevPosts) => prevPosts.filter((p) => p._id !== postId));
    } catch (error) {
      console.error('Error deleting post', error);
    }
  };

  if (!loggedInUser) {
    return <div>Loading...</div>;
  }

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 relative">
      {/* Menu */}
      <div className="fixed bottom-0 md:relative md:bottom-auto md:w-1/4 w-full z-10">
        <MenuPage />
      </div>

      {/* Profile Section */}
      <div className="flex-grow p-4 md:p-6 md:ml-1/4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={loggedInUser.avatar}
              alt="avatar"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{loggedInUser.userName}</h1>
              <p className="text-sm md:text-lg text-gray-600 mt-2">{loggedInUser.bio}</p>
              <div className="flex justify-center md:justify-start space-x-6 mt-4">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-700">Posts</h2>
                  <p className="text-gray-500">{post.length}</p>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => handleOpenUserListModal('followers')}
                    className="text-lg font-semibold text-blue-500 hover:underline"
                  >
                    Followers
                  </button>
                  <p className="text-gray-500">{loggedInUser.followers.length}</p>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => handleOpenUserListModal('following')}
                    className="text-lg font-semibold text-blue-500 hover:underline"
                  >
                    Following
                  </button>
                  <p className="text-gray-500">{loggedInUser.following.length}</p>
                </div>
              </div>
              <Button
                variant="text"
                startIcon={<HomeIcon />}
                component={Link}
                to="/users"
                className="mt-4 text-blue-500 hover:text-blue-700"
              >
                Add Friends
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {post.map((p) => (
            <div key={p._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b">
                <div className="flex items-center space-x-2">
                  <img
                    src={loggedInUser.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <p className="text-gray-800 text-sm font-medium">{loggedInUser.userName}</p>
                </div>
              </div>
              <div className="relative">{renderMedia(p.image)}</div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-2">{p.caption}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">{p.likes.length} likes</p>
                  <div className="flex space-x-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleViewComments(p)}
                    >
                      <CommentIcon />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeletePost(p._id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {isCommentsModalOpen && selectedPost && (
        <CommentsModal post={selectedPost} onClose={handleCloseCommentsModal} />
      )}
      {isUserListModalOpen && (
        <UserListModal
          userList={userList}
          listType={listType}
          onClose={handleCloseUserListModal}
        />
      )}
    </div>
  );
};

export default Profile;
