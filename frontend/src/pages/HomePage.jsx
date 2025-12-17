import React, { useState, useEffect } from 'react';
import GameSwiper from '../components/GameSwiper';
import GameCard from '../components/GameCard';
import { useGameContext } from '../contexts/GameContext';
import { FaFire, FaStar, FaTag, FaGamepad, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { games, loading, fetchGames } = useGameContext();
  const [filteredGames, setFilteredGames] = useState({
    featured: [],
    trending: [],
    onSale: [],
    all: []
  });

  useEffect(() => {
    if (games.length === 0) {
      fetchGames();
    }
  }, [games.length, fetchGames]);

  useEffect(() => {
    // Filter games berdasarkan kriteria
    if (games.length > 0) {
      const featured = games.filter(game => 
        game.is_featured === true || 
        game.is_featured === 'true' ||
        game.featured === true
      ).slice(0, 5);

      const trending = games.filter(game => 
        game.is_trending === true || 
        game.is_trending === 'true' ||
        game.trending === true ||
        (game.rating >= 4) // Fallback: game dengan rating tinggi
      ).slice(0, 4);

      const onSale = games.filter(game => {
        const discount = parseFloat(game.discount) || 0;
        return discount > 0;
      }).slice(0, 3);

      setFilteredGames({
        featured,
        trending,
        onSale,
        all: games.slice(0, 6)
      });
    }
  }, [games]);

  const getPrice = (value) => {
    if (!value) return 0;
    const price = parseFloat(value);
    return isNaN(price) ? 0 : price;
  };

  const getDiscount = (value) => {
    if (!value) return 0;
    const discount = parseFloat(value);
    return isNaN(discount) ? 0 : discount;
  };

  const calculateDiscountedPrice = (price, discount) => {
    const p = getPrice(price);
    const d = getDiscount(discount);
    return p * (1 - d / 100);
  };

  if (loading && games.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-steam-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading games...</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada game sama sekali
  if (games.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-3xl font-bold text-white mb-4">No Games Available</h1>
        <p className="text-gray-400 mb-8">Please check your database connection or run the seeder.</p>
        <button
          onClick={() => fetchGames()}
          className="bg-steam-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section dengan Featured Games */}
      <section>
        {filteredGames.featured.length > 0 ? (
          <GameSwiper games={filteredGames.featured} />
        ) : filteredGames.all.length > 0 ? (
          <GameSwiper games={filteredGames.all.slice(0, 5)} />
        ) : (
          <div className="relative bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 text-center p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to GameStore
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                Discover amazing games from various genres
              </p>
              <Link
                to="/games"
                className="inline-flex items-center gap-2 bg-steam-accent hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all"
              >
                Browse Games
                <FaArrowRight />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Trending Games */}
      {filteredGames.trending.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                <FaFire className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Trending Games</h2>
                <p className="text-gray-400">Popular games right now</p>
              </div>
            </div>
            <Link
              to="/games"
              className="text-steam-accent hover:text-blue-400 font-semibold flex items-center gap-2"
            >
              View All
              <FaArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGames.trending.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Special Deals - On Sale Games */}
      {filteredGames.onSale.length > 0 && (
        <section>
          <div className="bg-gradient-to-r from-red-900/20 via-purple-900/20 to-blue-900/20 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <FaTag className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Special Deals</h2>
                  <p className="text-gray-300">Games on sale</p>
                </div>
              </div>
              <Link
                to="/games"
                className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-2"
              >
                View All Deals
                <FaArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.onSale.map((game) => {
                const discount = getDiscount(game.discount);
                const originalPrice = getPrice(game.price);
                const discountedPrice = calculateDiscountedPrice(game.price, game.discount);
                
                return (
                  <div
                    key={game.id}
                    className="group bg-steam-dark rounded-xl overflow-hidden border border-white/5 hover:border-red-500 transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={game.image_url || 'https://via.placeholder.com/400x300/1b2838/ffffff?text=Game'}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {discount > 0 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg font-bold shadow-lg">
                          -{discount}%
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3">{game.title}</h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          {discount > 0 ? (
                            <>
                              <div className="text-2xl font-bold text-white">
                                ${discountedPrice.toFixed(2)}
                              </div>
                              <div className="text-gray-400 line-through text-sm">
                                ${originalPrice.toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div className="text-2xl font-bold text-white">
                              ${originalPrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                        
                        <Link
                          to={`/games/${game.id}`}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                        >
                          View Details
                        </Link>
                      </div>
                      
                      {game.category && (
                        <div className="text-gray-400 text-sm">
                          Category: <span className="text-white">{game.category}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Games Preview */}
      {filteredGames.all.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <FaGamepad className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">All Games</h2>
                <p className="text-gray-400">Browse our collection</p>
              </div>
            </div>
            <Link
              to="/games"
              className="text-steam-accent hover:text-blue-400 font-semibold flex items-center gap-2"
            >
              View All
              <FaArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {filteredGames.all.map((game, index) => (
              <Link key={game.id} to={`/games/${game.id}`} className="block">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-xl bg-steam-dark border border-white/5 hover:border-steam-accent transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={game.image_url || 'https://via.placeholder.com/300x200/1b2838/ffffff?text=Game'}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-3">
                    <h4 className="text-white font-medium truncate mb-1">
                      {game.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="text-white font-bold">
                        ${getPrice(game.price).toFixed(2)}
                      </div>
                      {game.category && (
                        <span className="px-2 py-1 bg-steam-blue/30 text-gray-300 text-xs rounded">
                          {game.category}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section>
        <div className="bg-gradient-to-r from-steam-blue/20 to-steam-dark/20 border border-white/10 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {games.length}
              </div>
              <div className="text-gray-400">Total Games</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {filteredGames.onSale.length}
              </div>
              <div className="text-gray-400">Games on Sale</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {filteredGames.featured.length}
              </div>
              <div className="text-gray-400">Featured Games</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {filteredGames.trending.length}
              </div>
              <div className="text-gray-400">Trending Games</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;