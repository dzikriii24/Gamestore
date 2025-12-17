import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import { useGameContext } from '../contexts/GameContext';
import { FaHeart, FaGamepad, FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useGameContext();
  const [filteredWishlist, setFilteredWishlist] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  // In a real app, you would fetch wishlist from API
  // For now, we'll simulate with some dummy data
  useEffect(() => {
    // Simulate wishlist data
    const simulateWishlist = async () => {
      // In a real implementation, you would fetch from API
      // const response = await fetchWishlist();
      // setFilteredWishlist(response);
    };
    simulateWishlist();
  }, []);

  useEffect(() => {
    let filtered = wishlist;
    if (categoryFilter) {
      filtered = filtered.filter(game => 
        game.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    setFilteredWishlist(filtered);
  }, [wishlist, categoryFilter]);

  const num = (v) => Number(v) || 0;
  const categories = [...new Set(wishlist.map(game => game.category))];

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-xl p-12 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-block mb-6"
          >
            <FaHeart className="text-6xl text-red-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-300 mb-8">
            Add games to your wishlist to keep track of titles you're interested in!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/games'}
              className="bg-steam-accent hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              <FaGamepad className="inline mr-2" />
              Browse Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-xl p-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500 rounded-xl">
            <FaHeart className="text-3xl text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">My Wishlist</h1>
            <p className="text-gray-300">
              {wishlist.length} game{wishlist.length !== 1 ? 's' : ''} in your wishlist
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-steam-darker rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <FaFilter className="text-gray-400" />
          <h3 className="text-white font-semibold">Filter by Category</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-4 py-2 rounded-lg transition-all ${
              categoryFilter === ''
                ? 'bg-steam-accent text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg transition-all ${
                categoryFilter === category
                  ? 'bg-steam-accent text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Wishlist Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {filteredWishlist.length} Game{filteredWishlist.length !== 1 ? 's' : ''}
          </h2>
          {categoryFilter && (
            <span className="bg-steam-blue px-4 py-2 rounded-lg text-white">
              Category: {categoryFilter}
            </span>
          )}
        </div>

        {filteredWishlist.length === 0 ? (
          <div className="text-center py-16 bg-steam-darker rounded-xl">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Games Found</h3>
            <p className="text-gray-400">Try changing your category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWishlist.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-steam-darker rounded-xl p-6">
          <div className="text-3xl font-bold text-white mb-2">
            {wishlist.length}
          </div>
          <div className="text-gray-400">Total Games</div>
        </div>
        <div className="bg-steam-darker rounded-xl p-6">
          <div className="text-3xl font-bold text-green-400 mb-2">
            $
            {wishlist
              .filter(g => num(g.discount) > 0)
              .reduce((total, game) => {
                const discountAmount = num(game.price) * (num(game.discount) / 100);
                return total + discountAmount;
              }, 0)
              .toFixed(2)}
          </div>
          <div className="text-gray-400">Total Savings</div>
        </div>
        <div className="bg-steam-darker rounded-xl p-6">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {wishlist.filter(g => g.discount > 0).length}
          </div>
          <div className="text-gray-400">Games on Sale</div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;