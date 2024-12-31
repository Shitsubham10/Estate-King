import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa'; // Assuming you're using the FaSearch icon
export default function Header() {
  const {currentUser} = useSelector((state)=>state.user)
  const[searchTerm , setSearchTerm] = useState('');
  const navigate = useNavigate();

  const HandleSubmit = (e) => {
    e.preventDefault();
    //to store the previous search term in the url
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('search', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
     
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  },[location.search])

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-semibold text-slate-800 tracking-wide">
            <span className="text-teal-600">Estate</span>
            <span className="text-slate-700">King</span>
          </h1>
        </Link>
  
        {/* Search Form */}
        <form onSubmit={HandleSubmit} className="flex items-center bg-slate-100 p-2 rounded-lg max-w-md w-full shadow-md">
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-transparent outline-none px-4 py-2 w-full text-sm text-slate-700 placeholder:text-slate-500 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="p-2 text-slate-500 hover:text-teal-600">
            <FaSearch />
          </button>
        </form>
  
        {/* Navigation Links */}
        <ul className="flex gap-8 items-center text-sm font-medium">
          <Link to="/">
            <li className="text-slate-700 hover:text-teal-600 transition-colors duration-300">Home</li>
          </Link>
          <Link to="/about">
            <li className="text-slate-700 hover:text-teal-600 transition-colors duration-300">About</li>
          </Link>
  
          {/* User Profile / SignIn */}
          <Link to="/profile" className="flex items-center space-x-2">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover border-2 border-teal-500"
                src={currentUser.avatar}
                alt="Profile"
              />
            ) : (
              <li className="text-slate-700 hover:text-teal-600 transition-colors duration-300">
                SignIn
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}