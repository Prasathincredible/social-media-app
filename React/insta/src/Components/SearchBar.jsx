import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MenuPage from "./MenuPage";

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]); // Store only user profiles
    const navigate = useNavigate(); // To navigate to user profiles

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.get(`https://social-media-app-kamd.onrender.com/search?q=${query}`);
            setResults(res.data.users); // Assume API returns `users` array based on the query
        } catch (err) {
            console.log('Error fetching search results:', err);
        }
    }

    const handleUserClick = (userName) => {
        navigate(`/users/${userName}`); // Assuming route to user profile is set up as `/profile/:userName`
    }

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto mt-10">
            <MenuPage/>
            <form onSubmit={handleSearch} className="flex items-center mb-4">
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for users..." 
                    className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    type="submit" 
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                    Search
                </button>
            </form>

            <div>
                <h3 className="text-lg font-semibold mb-2">Users:</h3>
                {results.length > 0 ? (
                    results.map((user) => (
                        <button 
                            key={user._id} 
                            onClick={() => handleUserClick(user.userName)}
                            className="block w-full text-left px-4 py-2 mb-2 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                            {user.userName}
                        </button>
                    ))
                ) : (
                    <p className="text-gray-500">No users found.</p>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
