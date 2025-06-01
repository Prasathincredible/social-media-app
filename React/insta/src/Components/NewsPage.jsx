import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import MenuPage from './MenuPage';
import CommentsModal from './CommentsModal';
import UserContext from '../contexts/UserContext';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {
  ArrowDownTrayIcon,
  HeartIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/solid';

function NewsPage() {
  const { loggedInUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('https://social-media-app-kamd.onrender.com/allPosts', {
          params: { userId: loggedInUser._id },
        });
        const fetchedPosts = res.data.map((post) => ({
          ...post,
          isLikedByUser: post.likes.includes(loggedInUser.userName),
        }));
        setPosts(fetchedPosts);
      } catch (err) {
        console.log('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [loggedInUser]);

  const handleLike = async (postId) => {
    const post = posts.find((post) => post._id === postId);
    const alreadyLiked = post.isLikedByUser;

    try {
      await axios.post(`https://social-media-app-kamd.onrender.com/posts/${postId}/like`, {
        userName: loggedInUser.userName,
      });
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: alreadyLiked
                  ? p.likes.filter((user) => user !== loggedInUser.userName)
                  : [...p.likes, loggedInUser.userName],
                isLikedByUser: !alreadyLiked,
              }
            : p
        )
      );
    } catch (err) {
      console.log('Error liking post:', err);
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const res = await axios.post(`https://social-media-app-kamd.onrender.com/posts/${postId}/comment`, {
        userName: loggedInUser.userName,
        comment,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: res.data.comments } : post
        )
      );
    } catch (err) {
      console.log('Error adding comment:', err);
    }
  };

  const handleViewComments = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const renderMedia = (url) => {
    if (!url) return null;
    const extension = url.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return <img src={url} alt="Post media" className="w-full h-auto rounded-lg" />;
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return <video controls src={url} className="w-full rounded-lg" />;
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return <audio controls src={url} className="w-full" />;
    } else if (extension === 'pdf') {
      return (
        <Worker>
          <Viewer fileUrl={url} />
        </Worker>
      );
    } else {
      return <p>Unsupported media format</p>;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col sm:flex-row">
      <div className="sm:w-1/4 bg-white shadow-lg p-4 fixed bottom-0 sm:static sm:h-auto">
        <MenuPage />
      </div>

      <div className="sm:w-3/4 flex-grow flex flex-col items-center py-6 px-4 space-y-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white shadow-md rounded-lg p-4 w-full max-w-xl"
          >
            <div className="flex items-center space-x-4">
             { /*<img
                src={post.userAvatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />*/}
              <p className="font-semibold text-gray-800">{post.userName}</p>
            </div>

            <div className="mt-4">{renderMedia(post.image)}</div>

            <p className="text-gray-700 mt-2">{post.caption}</p>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handleLike(post._id)}
                className={`flex items-center space-x-2 ${
                  post.isLikedByUser ? 'text-red-500' : 'text-gray-600'
                } hover:text-red-500`}
              >
                <HeartIcon className="w-6 h-6" />
                <span>{post.likes.length}</span>
              </button>

              <button
                onClick={() => handleViewComments(post)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
              >
                <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
                <span>{post.comments.length}</span>
              </button>
            </div>

            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full border rounded-lg p-2 mt-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  handleAddComment(post._id, e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CommentsModal selectedPost={selectedPost} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default NewsPage;