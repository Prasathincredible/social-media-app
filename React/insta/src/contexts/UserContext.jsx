

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(() => {
        const savedUser = localStorage.getItem('loggedInUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            try {
                const response = await axios.get('https://social-media-app-kamd.onrender.com/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setLoggedInUser(response.data);
                localStorage.setItem('loggedInUser', JSON.stringify(response.data));
            } catch (error) {
                console.log('Error fetching logged-in user details:', error);
                logoutUser();
            }
        };

        if (!loggedInUser) {
            fetchLoggedInUser();
        }
    }, [loggedInUser]);

    const logoutUser = () => {
        setLoggedInUser(null);
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <UserContext.Provider value={{ loggedInUser, setLoggedInUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};
