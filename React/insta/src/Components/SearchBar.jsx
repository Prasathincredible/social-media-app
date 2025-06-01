import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MenuPage from "./MenuPage";

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.get(`https://social-media-app-kamd.onrender.com/search?q=${query}`);
            setResults(res.data.users);
        } catch (err) {
            console.log('Error fetching search results:', err);
        }
    };

    const handleUserClick = (userName) => {
        navigate(`/users/${userName}`);
    };

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto mt-10">
            <MenuPage />

            {/* Back Button */}
            <button
                onClick={handleBack}
                className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
                ← Back
            </button>

            {/* Search Form */}
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

            {/* Search Results */}
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
