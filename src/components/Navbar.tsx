import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  

  
  return (
    <nav className="bg-gray-800 bg-opacity-75 shadow-lg p-4 w-full fixed top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        <div className="text-teal-300 text-2xl font-bold">
          <Link to="/">Sakila Manager</Link>
        </div>

        
        <div className="hidden md:flex space-x-6 font-semibold">
          <Link to="/" className="text-teal-400 hover:text-blue-400">Home</Link>
          <Link to="/films" className="text-teal-400 hover:text-blue-400">Films</Link>
          <Link to="/customers" className="text-teal-400 hover:text-blue-400">Customers</Link>
        </div>
        </div>
    </nav>
  );
};

export default Navbar;

