import React from 'react';


const CommentsModal = ({ selectedPost, onClose }) => {

    const comments=selectedPost ? selectedPost.comments : []; 
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {/*console.log(post.comments)*/}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Display Comments */}
        {comments.length > 0 ? (
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {comments.map((comment, index) => {
                return(
              <div key={index} className="border-b pb-2 mb-2">
                <p className="font-semibold">{comment.userName}:</p>
                <p className="text-gray-600">{comment.comment}</p>
              </div>
                );
})}
          </div>
        ) : (
          <p>No comments yet.</p>
        )}

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CommentsModal;
