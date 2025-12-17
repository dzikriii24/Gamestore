import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import { useGameContext } from '../contexts/GameContext';
import { 
  FaTag, FaClock, FaFilter, FaSearch, FaSortAmountDown, 
  FaFire, FaPercentage, FaArrowRight, FaTimes 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DealsPage = () => {
  const { games, loading, fetchGames } = useGameContext();
  const [filteredGames, setFilteredGames] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('discount_desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [minDiscount, setMinDiscount] = useState(0);

  useEffect(() => {
    // Fetch games jika belum ada
    if (games.length === 0) {
      fetchGames();
    }
  }, [games.length, fetchGames]);

  useEffect(() => {
    // Filter games untuk on-sale
    let onSaleGames = games.filter(game => {
      const discount = parseFloat(game.discount) || 0;
      const meetsDiscount = discount >= minDiscount;
      
      // Filter dengan search term jika ada
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return meetsDiscount && discount > 0 && (
          game.title.toLowerCase().includes(term) ||
          game.category?.toLowerCase().includes(term) ||
          game.developer?.toLowerCase().includes(term) ||
          game.description?.toLowerCase().includes(term)
        );
      }
      
      return meetsDiscount && discount > 0;
    });

    // Sort berdasarkan pilihan
    switch (sortBy) {
      case 'discount_desc':
        onSaleGames.sort((a, b) => {
          const discountA = parseFloat(a.discount) || 0;
          const discountB = parseFloat(b.discount) || 0;
          return discountB - discountA;
        });
        break;
      case 'price_asc':
        onSaleGames.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          const discountA = parseFloat(a.discount) || 0;
          const discountB = parseFloat(b.discount) || 0;
          const finalPriceA = priceA * (1 - discountA / 100);
          const finalPriceB = priceB * (1 - discountB / 100);
          return finalPriceA - finalPriceB;
        });
        break;
      case 'price_desc':
        onSaleGames.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          const discountA = parseFloat(a.discount) || 0;
          const discountB = parseFloat(b.discount) || 0;
          const finalPriceA = priceA * (1 - discountA / 100);
          const finalPriceB = priceB * (1 - discountB / 100);
          return finalPriceB - finalPriceA;
        });
        break;
      case 'rating_desc':
        onSaleGames.sort((a, b) => {
          const ratingA = parseInt(a.rating) || 0;
          const ratingB = parseInt(b.rating) || 0;
          return ratingB - ratingA;
        });
        break;
      default:
        // Default: sort by discount (highest first)
        onSaleGames.sort((a, b) => {
          const discountA = parseFloat(a.discount) || 0;
          const discountB = parseFloat(b.discount) || 0;
          return discountB - discountA;
        });
        break;
    }

    setFilteredGames(onSaleGames);
  }, [games, sortBy, searchTerm, minDiscount]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search sudah di-handle di useEffect
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('discount_desc');
    setMinDiscount(0);
  };

  const getStats = () => {
    const total = filteredGames.length;
    
    const totalOriginalPrice = filteredGames.reduce((sum, game) => {
      return sum + (parseFloat(game.price) || 0);
    }, 0);
    
    const totalDiscountedPrice = filteredGames.reduce((sum, game) => {
      const price = parseFloat(game.price) || 0;
      const discount = parseFloat(game.discount) || 0;
      return sum + (price * (1 - discount / 100));
    }, 0);
    
    const totalSavings = totalOriginalPrice - totalDiscountedPrice;
    
    const highestDiscount = filteredGames.length > 0
      ? Math.max(...filteredGames.map(g => parseFloat(g.discount) || 0))
      : 0;
    
    const averageDiscount = filteredGames.length > 0
      ? (filteredGames.reduce((sum, game) => sum + (parseFloat(game.discount) || 0), 0) / filteredGames.length).toFixed(1)
      : 0;

    return { 
      total, 
      highestDiscount, 
      averageDiscount, 
      totalSavings,
      totalOriginalPrice,
      totalDiscountedPrice
    };
  };

  const stats = getStats();

  // Countdown timer (fake untuk UI)
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 30,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading && games.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-steam-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading special deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header dengan Countdown */}
      <div className="bg-gradient-to-r from-green-900/30 via-emerald-900/30 to-teal-900/30 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <FaTag className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Special Deals</h1>
                <p className="text-gray-300 mt-2">Limited time offers with massive discounts</p>
              </div>
            </div>
            
            {/* Countdown Timer */}
            <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaClock className="text-red-400 animate-pulse" />
                <div className="text-white font-semibold">Flash Sale Ending!</div>
              </div>
              <div className="flex gap-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white bg-green-900/50 px-3 py-1 rounded">
                    {timeLeft.days.toString().padStart(2, '0')}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">Days</div>
                </div>
                <div className="text-white text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white bg-green-900/50 px-3 py-1 rounded">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">Hours</div>
                </div>
                <div className="text-white text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white bg-green-900/50 px-3 py-1 rounded">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">Minutes</div>
                </div>
                <div className="text-white text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white bg-green-900/50 px-3 py-1 rounded">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">Seconds</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
              <div className="text-gray-400">Games on Sale</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-green-400 mb-2">{stats.highestDiscount}%</div>
              <div className="text-gray-400">Highest Discount</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.averageDiscount}%</div>
              <div className="text-gray-400">Average Discount</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                ${stats.totalSavings.toFixed(2)}
              </div>
              <div className="text-gray-400">Total Savings</div>
            </div>
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
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-steam-mid text-white px-6 py-3 pl-12 rounded-lg border border-white/5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                >
                  <option value="discount_desc">Highest Discount</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Highest Rated</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">
                  <FaPercentage className="inline mr-2" />
                  Minimum Discount
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={minDiscount}
                    onChange={(e) => setMinDiscount(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-white font-medium w-12">{minDiscount}%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Quick Actions</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setMinDiscount(50)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                  >
                    50%+ Discounts
                  </button>
                  <button
                    onClick={() => setMinDiscount(0)}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
                  >
                    All Discounts
                  </button>
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
            {filteredGames.length} {filteredGames.length === 1 ? 'Deal' : 'Deals'} Available
          </h2>
          <div className="text-gray-400 text-sm">
            Min discount: <span className="text-green-400 font-medium">{minDiscount}%</span>
            <span className="mx-2">•</span>
            Sorted by: <span className="text-white font-medium">
              {sortBy === 'discount_desc' ? 'Highest Discount' :
               sortBy === 'price_asc' ? 'Price (Low to High)' :
               sortBy === 'price_desc' ? 'Price (High to Low)' : 'Highest Rated'}
            </span>
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="text-center py-16 bg-steam-darker/50 rounded-2xl">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Deals Found</h3>
            <p className="text-gray-400 mb-6">
              {minDiscount > 0 
                ? `No games found with ${minDiscount}% or more discount. Try lowering the minimum discount.`
                : 'No games are currently on sale. Check back later!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setMinDiscount(0)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all"
              >
                Show All Games
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
            {/* Big Discount Banner */}
            {stats.highestDiscount >= 70 && (
              <div className="mb-8 p-4 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <FaFire className="text-2xl text-orange-400 animate-pulse" />
                  <div className="flex-1">
                    <div className="text-white font-bold">🔥 MEGA DEAL ALERT!</div>
                    <div className="text-gray-300 text-sm">
                      Games with {stats.highestDiscount}% discount available!
                    </div>
                  </div>
                  <Link
                    to="/games"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold text-sm transition-all"
                  >
                    Grab Them Now
                  </Link>
                </div>
              </div>
            )}

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game, index) => {
                const discount = parseFloat(game.discount) || 0;
                const originalPrice = parseFloat(game.price) || 0;
                const discountedPrice = originalPrice * (1 - discount / 100);
                const savings = originalPrice - discountedPrice;
                
                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative">
                      {/* Discount Badge Overlay */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className={`px-3 py-1 rounded-lg font-bold text-sm shadow-lg ${
                          discount >= 70 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                          discount >= 50 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}>
                          <div className="text-white">-{discount}%</div>
                          {discount >= 70 && (
                            <div className="text-xs text-white/80">MEGA DEAL</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Savings Badge */}
                      <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
                        <div className="text-green-400 text-xs font-bold">
                          Save ${savings.toFixed(2)}
                        </div>
                      </div>
                      
                      <GameCard game={game} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Best Value Deals */}
            {filteredGames.length >= 3 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  💰 Best Value Deals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredGames
                    .sort((a, b) => {
                      // Sort by best value (discount ratio * rating)
                      const valueA = (parseFloat(a.discount) || 0) * (parseInt(a.rating) || 0);
                      const valueB = (parseFloat(b.discount) || 0) * (parseInt(b.rating) || 0);
                      return valueB - valueA;
                    })
                    .slice(0, 3)
                    .map((game, index) => {
                      const discount = parseFloat(game.discount) || 0;
                      const originalPrice = parseFloat(game.price) || 0;
                      const discountedPrice = originalPrice * (1 - discount / 100);
                      
                      return (
                        <div
                          key={game.id}
                          className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-white/5"
                        >
                          {/* Value Badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg">
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
                                  <div className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm font-bold">
                                    -{discount}% OFF
                                  </div>
                                  <div className="text-yellow-400 text-sm">
                                    ⭐ {parseInt(game.rating) || 5}/5
                                  </div>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                  <div className="flex items-baseline gap-2">
                                    <div className="text-2xl font-bold text-white">
                                      ${discountedPrice.toFixed(2)}
                                    </div>
                                    <div className="text-gray-400 line-through">
                                      ${originalPrice.toFixed(2)}
                                    </div>
                                  </div>
                                  <div className="text-green-400 text-sm font-medium">
                                    Save ${(originalPrice - discountedPrice).toFixed(2)}!
                                  </div>
                                </div>
                                
                                <Link
                                  to={`/games/${game.id}`}
                                  className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 rounded-lg font-semibold transition-all"
                                >
                                  Get This Deal
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-white/10 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Don't Miss Out on These Deals!
        </h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          These prices won't last forever. Add games to your cart now before the sale ends!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/cart"
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-green-500/30"
          >
            View Cart
          </Link>
          <Link
            to="/games"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold text-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;