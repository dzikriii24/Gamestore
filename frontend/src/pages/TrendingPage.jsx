import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import { useGameContext } from '../contexts/GameContext';
import { FaFire, FaFilter, FaSortAmountDown, FaSortAmountUp, FaSearch, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TrendingPage = () => {
  const { games, loading, fetchGames, applyFilters } = useGameContext();
  const [filteredGames, setFilteredGames] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('trending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch games jika belum ada
    if (games.length === 0) {
      fetchGames();
    }
  }, [games.length, fetchGames]);

  useEffect(() => {
    // Filter games untuk trending
    let trending = games;
    
    // Filter berdasarkan trending flag
    trending = games.filter(game => {
      const isTrending = game.is_trending === true || 
                        game.is_trending === 'true' || 
                        game.trending === true ||
                        game.rating >= 4; // Fallback: rating tinggi dianggap trending
      
      // Filter dengan search term jika ada
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return isTrending && (
          game.title.toLowerCase().includes(term) ||
          game.category?.toLowerCase().includes(term) ||
          game.developer?.toLowerCase().includes(term) ||
          game.description?.toLowerCase().includes(term)
        );
      }
      
      return isTrending;
    });

    // Sort berdasarkan pilihan
    switch (sortBy) {
      case 'rating_desc':
        trending.sort((a, b) => {
          const ratingA = parseInt(a.rating) || 0;
          const ratingB = parseInt(b.rating) || 0;
          return ratingB - ratingA;
        });
        break;
      case 'price_asc':
        trending.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceA - priceB;
        });
        break;
      case 'price_desc':
        trending.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceB - priceA;
        });
        break;
      case 'discount_desc':
        trending.sort((a, b) => {
          const discountA = parseFloat(a.discount) || 0;
          const discountB = parseFloat(b.discount) || 0;
          return discountB - discountA;
        });
        break;
      case 'trending':
      default:
        // Default: sort by rating (highest first)
        trending.sort((a, b) => {
          const ratingA = parseInt(a.rating) || 0;
          const ratingB = parseInt(b.rating) || 0;
          return ratingB - ratingA;
        });
        break;
    }

    setFilteredGames(trending);
  }, [games, sortBy, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search sudah di-handle di useEffect
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('trending');
  };

  const getStats = () => {
    const total = filteredGames.length;
    const averageRating = filteredGames.length > 0
      ? (filteredGames.reduce((sum, game) => sum + (parseInt(game.rating) || 0), 0) / filteredGames.length).toFixed(1)
      : 0;
    const onSale = filteredGames.filter(game => parseFloat(game.discount) > 0).length;
    const totalPrice = filteredGames.reduce((sum, game) => sum + (parseFloat(game.price) || 0), 0).toFixed(0);

    return { total, averageRating, onSale, totalPrice };
  };

  const stats = getStats();

  if (loading && games.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-steam-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading trending games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
              <FaFire className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Trending Games</h1>
              <p className="text-gray-300 mt-2">Most popular and highly rated games right now</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-white/5 rounded-lg">
              <span className="text-gray-400">Total: </span>
              <span className="text-white font-bold text-xl">{stats.total}</span>
            </div>
            <div className="px-4 py-2 bg-white/5 rounded-lg">
              <span className="text-gray-400">Avg Rating: </span>
              <span className="text-yellow-400 font-bold text-xl">{stats.averageRating}/5</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
            <div className="text-gray-400">Trending Games</div>
          </div>
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-2">{stats.onSale}</div>
            <div className="text-gray-400">On Sale</div>
          </div>
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-2">${stats.totalPrice}</div>
            <div className="text-gray-400">Total Value</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-steam-dark border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search trending games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-steam-mid text-white px-6 py-3 pl-12 rounded-lg border border-white/5 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <FaFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 bg-steam-mid/50 border border-white/5 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                >
                  <option value="trending">Trending (Default)</option>
                  <option value="rating_desc">Highest Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="discount_desc">Biggest Discount</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Quick Links</label>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/games?on_sale=true"
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
                  >
                    On Sale Games
                  </Link>
                  <Link
                    to="/games?category=Action"
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                  >
                    Action Games
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Games Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {filteredGames.length} Trending {filteredGames.length === 1 ? 'Game' : 'Games'} Found
          </h2>
          <div className="text-gray-400 text-sm">
            Sorted by: <span className="text-white font-medium">
              {sortBy === 'trending' ? 'Trending' : 
               sortBy === 'rating_desc' ? 'Highest Rating' :
               sortBy === 'price_asc' ? 'Price (Low to High)' :
               sortBy === 'price_desc' ? 'Price (High to Low)' : 'Biggest Discount'}
            </span>
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="text-center py-16 bg-steam-darker/50 rounded-2xl">
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Trending Games Found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or check out all games</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all"
              >
                Clear Filters
              </button>
              <Link
                to="/games"
                className="px-6 py-3 bg-steam-blue hover:bg-steam-accent text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Browse All Games
                <FaArrowRight />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </div>

            {/* Top Picks Section */}
            {filteredGames.length >= 3 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  🔥 Top Trending Picks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredGames.slice(0, 3).map((game, index) => (
                    <div
                      key={game.id}
                      className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 border border-white/5"
                    >
                      {/* Ranking Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          #{index + 1}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={game.image_url}
                            alt={game.title}
                            className="w-24 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-2">
                              {game.title}
                            </h4>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <FaFire
                                    key={i}
                                    className={`text-sm ${
                                      i < (parseInt(game.rating) || 0) ? 'text-yellow-400' : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-yellow-400 font-bold">
                                {parseInt(game.rating) || 5}/5
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-2xl font-bold text-white">
                                  ${parseFloat(game.price).toFixed(2)}
                                </div>
                                {parseFloat(game.discount) > 0 && (
                                  <div className="text-green-400 text-sm">
                                    -{game.discount}% OFF
                                  </div>
                                )}
                              </div>
                              <Link
                                to={`/games/${game.id}`}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Featured Categories */}
      <div className="bg-steam-dark border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Popular Categories</h3>
        <div className="flex flex-wrap gap-3">
          {['Action', 'RPG', 'Adventure', 'FPS', 'Strategy', 'Sports'].map((category) => (
            <Link
              key={category}
              to={`/games?category=${category}`}
              className="px-4 py-2 bg-steam-blue/20 hover:bg-steam-blue/30 text-gray-300 hover:text-white rounded-lg transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;