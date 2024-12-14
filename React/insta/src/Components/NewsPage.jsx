import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import MenuPage from './MenuPage';
import CommentsModal from './CommentsModal';
import { UserContext } from '../contexts/UserContext';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import * as pdfjs from 'pdfjs-dist';
import { ArrowDownTrayIcon, HeartIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
        const fetchedPosts = res.data.map(post => ({
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

  const handleLike = (postId) => {
    const post = posts.find(post => post._id === postId);
    const alreadyLiked = post.isLikedByUser;

    axios.post(`https://social-media-app-kamd.onrender.com/posts/${postId}/like`, { userName: loggedInUser.userName })
      .then(() => {
        setPosts(posts.map(p => {
          if (p._id === postId) {
            return {
              ...p,
              likes: alreadyLiked
                ? p.likes.filter(user => user !== loggedInUser.userName)
                : [...p.likes, loggedInUser.userName],
              isLikedByUser: !alreadyLiked,
            };
          }
          return p;
        }));
      })
      .catch((err) => console.log('Error liking post:', err));
  };

  const handleAddComment = (postId, comment) => {
    axios.post(`https://social-media-app-kamd.onrender.com/posts/${postId}/comment`, {
      userName: loggedInUser.userName,
      comment: comment,
    })
      .then((res) => {
        setPosts(posts.map(post =>
          post._id === postId ? { ...post, comments: res.data.comments } : post
        ));
      })
      .catch((err) => {
        console.log('Error adding comment:', err);
      });
  };

  const handleViewComments = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const triggerDownload = async (downloadUrl, filename) => {
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const renderMedia = (url) => {
    if (!url) return <p>No media available.</p>;

    const extension = url.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return (
        <div className="relative my-2 group hover:shadow-lg transition-all">
          <img src={url} alt="post" className="w-full h-64 object-cover rounded-md" />
          <button
            onClick={() => triggerDownload(url, `image.${extension}`)}
            className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ArrowDownTrayIcon className="w-6 h-6" />
          </button>
        </div>
      );
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return (
        <div className="relative my-2 group hover:shadow-lg transition-all">
          <video controls className="w-full h-64 rounded-md">
            <source src={url} type={`video/${extension}`} />
            Your browser does not support the video tag.
          </video>
          <button
            onClick={() => triggerDownload(url, `video.${extension}`)}
            className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ArrowDownTrayIcon className="w-6 h-6" />
          </button>
        </div>
      );
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return (
        <div className="relative my-2 group hover:shadow-lg transition-all">
          <audio controls className="w-full rounded-md">
            <source src={url} type={`audio/${extension}`} />
            Your browser does not support the audio element.
          </audio>
          <button
            onClick={() => triggerDownload(url, `audio.${extension}`)}
            className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ArrowDownTrayIcon className="w-6 h-6" />
          </button>
        </div>
      );
    } else if (extension === 'pdf') {
      const updatedUrl = url.replace('image/upload', 'raw/upload');
      return (
        <div className="relative my-2 group hover:shadow-lg transition-all">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
            <Viewer fileUrl={updatedUrl} renderError={() => <p>Unable to display PDF.</p>} />
          </Worker>
          <button
            onClick={() => triggerDownload(updatedUrl, 'document.pdf')}
            className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ArrowDownTrayIcon className="w-6 h-6" />
          </button>
        </div>
      );
    } else {
      return <p>Unsupported media format.</p>;
    }
  };

  return (
    <div className="bg-black min-h-screen py-10 px-4 sm:px-10 flex flex-col sm:flex-row justify-center">
      <div className="w-full sm:w-1/4 mb-6 sm:mb-0">
        <MenuPage />
      </div>

      <div className="w-full sm:w-3/4 flex flex-col items-center space-y-6">
        {posts.map((p) => (
          <div key={p._id} className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <p className="text-lg font-semibold text-gray-800">{p.userName}</p>

            {renderMedia(p.image)}

            <p className="text-gray-700">{p.caption}</p>

            <div className="flex justify-between items-center">
              <button
                onClick={() => handleLike(p._id)}
                className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors"
              >
                <HeartIcon className="w-6 h-6" />
                <span>{p.likes.length}</span>
              </button>
              <button
                onClick={() => handleViewComments(p)}
                className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors"
              >
                <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
                <span>{p.comments.length}</span>
              </button>
            </div>

            <div className="pt-2">
              <input
                type="text"
                placeholder="Add a comment"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleAddComment(p._id, e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CommentsModal
          selectedPost={selectedPost}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default NewsPage;
