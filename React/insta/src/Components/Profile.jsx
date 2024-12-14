import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import MenuPage from './MenuPage';
import CommentsModal from './CommentsModal';
import UserListModal from './UserListModal';
import { UserContext } from '../contexts/UserContext';

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
    <div className="min-h-screen flex bg-gray-100">
      <MenuPage />
      <div className="flex-grow p-6 ml-60">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
          <div className="flex items-center space-x-6">
            <img
              src={loggedInUser.avatar}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-gray-200"
            />
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-800">{loggedInUser.userName}</h1>
              <p className="text-lg text-gray-600 mt-2">{loggedInUser.bio}</p>
              <div className="flex space-x-12 mt-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-700">Posts</h2>
                  <p className="text-gray-500 text-lg">{post.length}</p>
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => handleOpenUserListModal('followers')}
                    variant="text"
                    className="text-lg font-semibold text-blue-500"
                  >
                    Followers
                  </Button>
                  <p className="text-gray-500 text-lg">{loggedInUser.followers.length}</p>
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => handleOpenUserListModal('following')}
                    variant="text"
                    className="text-lg font-semibold text-blue-500"
                  >
                    Following
                  </Button>
                  <p className="text-gray-500 text-lg">{loggedInUser.following.length}</p>
                </div>
              </div>
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

        {/* Posts Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {post.map((p) => (
            <div key={p._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {renderMedia(p.image)}
              <div className="p-4">
                <p className="text-gray-800 font-semibold text-lg">{p.caption}</p>
                <p className="text-sm text-gray-500 mt-2">Likes: {p.likes.length}</p>
                <Button
                  variant="outlined"
                  className="mt-4 w-full text-blue-500 hover:bg-blue-50"
                  onClick={() => handleViewComments(p)}
                >
                  View Comments
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  className="mt-2 w-full text-red-500 hover:bg-red-50"
                  onClick={() => handleDeletePost(p._id)}
                >
                  Delete
                </Button>
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
