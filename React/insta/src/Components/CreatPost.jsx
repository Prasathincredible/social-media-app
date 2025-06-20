import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, CircularProgress } from '@mui/material';
import MenuPage from './MenuPage';

function CreatePost() {
  const [file, setFile] = useState('');
  const [caption, setCaption] = useState('');
  const [posts, setPost] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      setAlertMessage('Please provide a file to upload');
      setShowAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    const token = localStorage.getItem('token');

    setLoading(true);

    axios.post('https://social-media-app-kamd.onrender.com/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    })
      .then((res) => {
        setAlertMessage('Post created successfully');
        setShowAlert(true);
        setPost(prev => [...prev, res.data]);
        setTimeout(() => {
          navigate('/homepage');
        }, 2000);
      })
      .catch((err) => {
        setAlertMessage('Error creating post. Please try again.');
        setShowAlert(true);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const goBack = () => {
    navigate(-1); // Go to previous page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-green-100 flex flex-col items-center justify-center py-8">
      <MenuPage />

      {showAlert && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full mt-4">
            <p className="text-center text-gray-700 mb-2">{alertMessage}</p>
            <div className="text-center">
              <button
                onClick={closeAlert}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <CircularProgress />
          </div>
        )}
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Create Post</h1>
        
        {/* Back Button */}
        <div className="mb-4">
          <button
  onClick={() => navigate(-1)}
  className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 z-20"
>
  ← Back
</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type='file'
              onChange={(e) => setFile(e.target.files[0])}
              accept="audio/*,video/*,image/*,application/pdf"
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <textarea
              className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              rows={4}
              placeholder='Write your caption (optional)'
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <Button
            variant='contained'
            color="primary"
            type="submit"
            className="w-full py-3 text-lg"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Create Post'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
