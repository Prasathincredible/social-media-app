import React from 'react';
import { Modal, Box, Typography, List, ListItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserListModal = ({ userList = [], listType, onClose }) => {
  const navigate = useNavigate();

  const handleUserClick = (userName) => {
    onClose(); // Close the modal before navigating
    navigate(`/users/${userName}`);
  };

  return (
    <Modal open onClose={onClose}>
      <Box className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-24">
        <Typography variant="h6" component="h2" className="mb-4 text-center">
          {listType === 'followers' ? 'Followers' : 'Following'}
        </Typography>
        <List>
          {Array.isArray(userList) && userList.length > 0 ? (
            userList.map((userName, index) => (
              <ListItem key={index} className="text-lg font-medium">
                <Button
                  onClick={() => handleUserClick(userName)}
                  className="w-full text-left"
                >
                  {userName}
                </Button>
              </ListItem>
            ))
          ) : (
            <ListItem className="text-lg font-medium">No users found.</ListItem>
          )}
        </List>
      </Box>
    </Modal>
  );
};

export default UserListModal;
