import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaGamepad,
  FaFire,
  FaTag,
  FaShoppingBag,
  FaHeart,
  FaUser,
  FaCog,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
  FaSearch,
  FaStore,
  FaTrophy,
  FaQuestionCircle
} from 'react-icons/fa';
import { useGameContext } from '../contexts/GameContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categories, cart, wishlist } = useGameContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(true);

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome />, exact: true },
    { path: '/games', label: 'All Games', icon: <FaGamepad /> },
    { path: '/trending', label: 'Trending', icon: <FaFire /> },
    { path: '/deals', label: 'Special Deals', icon: <FaTag /> },
    { path: '/cart', label: 'My Cart', icon: <FaShoppingBag />, badge: cart?.totalItems || 0 },
    { path: '/wishlist', label: 'Wishlist', icon: <FaHeart />, badge: wishlist?.length || 0 },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
    { path: '/admin', label: 'Admin', icon: <FaCog /> },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_authenticated');
    navigate('/login');
  };

  // Toggle sidebar on mobile
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-steam-dark rounded-lg text-white"
      >
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'} h-screen flex flex-col bg-steam-dark border-r border-white/5`}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 hidden md:flex items-center justify-center w-6 h-6 bg-steam-accent rounded-full text-white"
        >
          {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
        </button>

        {/* Logo */}
        <div className={`p-6 border-b border-white/5 ${isCollapsed ? 'px-4' : ''}`}>
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-steam-accent to-blue-500 rounded-lg flex items-center justify-center">
                <FaStore className="text-white text-xl" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-steam-accent to-blue-500 bg-clip-text text-transparent">
                GAME<span className="text-white">STORE</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">Digital Game Distribution</p>
            </>
          )}
        </div>

        {/* Search Bar (only when expanded) */}
        {!isCollapsed && (
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search games..."
                className="w-full bg-steam-mid text-white px-4 py-2 pl-10 rounded-lg text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-steam-accent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {navItems.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'justify-between px-4'} py-3 rounded-lg transition-all duration-300 border ${
                    active
                      ? 'bg-gradient-to-r from-steam-accent/20 to-blue-500/20 text-white border-steam-accent/30 shadow-lg'
                      : 'text-gray-400 hover:bg-steam-mid hover:text-white border-transparent hover:border-white/10'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className={`flex items-center ${isCollapsed ? 'gap-0' : 'gap-3'}`}>
                    <span className={`${active ? 'text-steam-accent' : 'text-gray-400'} ${isCollapsed ? 'text-xl' : 'text-lg'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                  
                  {!isCollapsed && item.badge > 0 && (
                    <span className="bg-steam-accent text-white text-xs px-2 py-1 rounded-full min-w-6 h-6 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  
                  {isCollapsed && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white">{item.badge}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Categories Section */}
          {!isCollapsed && categories.length > 0 && (
            <div className="mt-8 px-3">
              <div className="flex items-center justify-between px-4 mb-3">
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                  Categories
                </h3>
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="text-gray-500 hover:text-white"
                >
                  {showCategories ? <FaChevronRight /> : <FaChevronLeft />}
                </button>
              </div>
              
              {showCategories && (
                <div className="space-y-1">
                  {categories.slice(0, 6).map((category) => (
                    <Link
                      key={category}
                      to={`/games?category=${category}`}
                      onClick={handleNavClick}
                      className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors duration-300 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FaChevronRight className="text-xs" />
                        {category}
                      </div>
                    </Link>
                  ))}
                  
                  {categories.length > 6 && (
                    <Link
                      to="/games"
                      onClick={handleNavClick}
                      className="block px-4 py-2 text-steam-accent hover:text-blue-400 hover:bg-white/5 rounded transition-colors duration-300 text-sm text-center"
                    >
                      View All Categories →
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          {!isCollapsed && (
            <div className="mt-8 px-3">
              <Link
                to="/help"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
              >
                <FaQuestionCircle />
                <span>Help & Support</span>
              </Link>
              
              <Link
                to="/achievements"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
              >
                <FaTrophy />
                <span>Achievements</span>
              </Link>
            </div>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className={`p-4 border-t border-white/5 ${isCollapsed ? 'px-3' : ''}`}>
          {isCollapsed ? (
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                title="Logout"
              >
                <FaUser />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-steam-accent to-blue-500 rounded-full flex items-center justify-center">
                    <img src="https://i.pinimg.com/736x/b2/89/3a/b2893a230478bfc7fd8584e15130ef85.jpg" className='rounded-full' alt="" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-steam-dark"></div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium truncate">Dzikri Rabbani</p>
                  <p className="text-gray-400 text-sm truncate">Premium Member</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link
                  to="/profile"
                  onClick={handleNavClick}
                  className="flex-1 text-center px-3 py-2 bg-steam-mid hover:bg-steam-accent text-white rounded-lg text-sm transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white rounded-lg text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

        {/* Version Info */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-t border-white/5">
            <div className="text-center text-gray-500 text-xs">
              <div>Version 1.0.0</div>
              <div className="mt-1">© 2024 GameStore</div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile sidebar backdrop (only for collapsed state on desktop) */}
      {isCollapsed && (
        <div
          className="hidden md:block fixed inset-0 bg-black/0 z-30"
          onClick={() => setIsCollapsed(false)}
        />
      )}
    </>
  );
};

export default Sidebar;