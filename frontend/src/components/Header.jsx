import React from 'react';
import { FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';
import { useGameContext } from '../contexts/GameContext';

const Header = () => {
  const { cart } = useGameContext();

  return (
    <header className="glass-panel bg-gradient-to-r from-steam-panel/90 via-steam-mid/80 to-steam-panel/90 border-b border-white/5 px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between gap-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search games, genres, developers..."
              className="w-full bg-steam-mid/70 border border-white/5 text-white px-6 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-steam-accent shadow-inner shadow-black/40"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <div className="relative">
            <button className="p-2 hover:bg-steam-mid/70 rounded-lg border border-white/5 transition-all">
              <div className="relative">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-steam-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Notifications */}
          <button className="p-2 hover:bg-steam-mid/70 rounded-lg relative border border-white/5 transition-all">
            <FaBell className="w-5 h-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white font-medium">Gamer Profile</p>
              <p className="text-gray-400 text-sm">Premium Member</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-r from-steam-accent to-blue-500 rounded-full flex items-center justify-center shadow-steam-glow">
              <FaUserCircle className="text-2xl text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;