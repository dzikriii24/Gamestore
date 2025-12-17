import React, { useState, useEffect } from 'react';
import { 
  FaStar, FaHeart, FaShoppingCart, FaEye, 
  FaTimes, FaTag, FaGamepad, FaCalendar,
  FaBuilding, FaShoppingBag, FaCheck,
  FaMinus, FaPlus, FaShareAlt
} from 'react-icons/fa';
import { useGameContext } from '../contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const GameCard = ({ game }) => {
  const { addToCart, toggleWishlist, checkWishlist } = useGameContext();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Pastikan price adalah number
  const price = parseFloat(game.price) || 0;
  const discount = parseFloat(game.discount) || 0;
  const rating = parseInt(game.rating) || 0;
  const discountedPrice = price * (1 - discount / 100);
  const ageRating = parseInt(game.age_rating) || 18;

  // Parse tags dari JSON string atau array
  const tags = React.useMemo(() => {
    try {
      if (Array.isArray(game.tags)) return game.tags;
      if (typeof game.tags === 'string') return JSON.parse(game.tags);
      return [];
    } catch (e) {
      console.error('Error parsing tags:', e);
      return [];
    }
  }, [game.tags]);

  // Parse screenshots
  const screenshots = React.useMemo(() => {
    try {
      if (Array.isArray(game.screenshots)) return game.screenshots;
      if (typeof game.screenshots === 'string') return JSON.parse(game.screenshots);
      return [];
    } catch (e) {
      console.error('Error parsing screenshots:', e);
      return [];
    }
  }, [game.screenshots]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const status = await checkWishlist(game.id);
      setIsInWishlist(status);
    };
    checkWishlistStatus();
  }, [game.id, checkWishlist]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(game, quantity);
    toast.success(`${game.title} added to cart!`);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(game);
    setIsInWishlist(!isInWishlist);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    setShowDetailModal(true);
  };

  const handleShareGame = () => {
    if (navigator.share) {
      navigator.share({
        title: game.title,
        text: `Check out ${game.title} on our game store!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Game link copied to clipboard!');
    }
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setQuantity(1);
  };

  return (
    <>
      <motion.div
        className="relative group bg-steam-dark rounded-lg overflow-hidden border border-gray-800 hover:border-steam-accent transition-all duration-300 hover:shadow-2xl hover:shadow-steam-accent/20 cursor-pointer"
        whileHover={{ y: -5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-steam-green text-white px-2 py-1 rounded-md font-bold text-sm">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
            isInWishlist
              ? 'bg-red-500 text-white'
              : 'bg-black/50 text-white hover:bg-red-500'
          }`}
        >
          <FaHeart className={isInWishlist ? 'animate-pulse' : ''} />
        </button>

        {/* Game Image */}
        <div className="relative h-48 overflow-hidden" onClick={handleViewDetails}>
          <img
            src={game.image_url}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200/1b2838/ffffff?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Game Info */}
        <div className="p-4" onClick={handleViewDetails}>
          <h3 className="text-white font-semibold text-lg mb-2 truncate">
            {game.title}
          </h3>
          
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-sm ${
                  i < rating ? 'text-yellow-400' : 'text-gray-600'
                }`}
              />
            ))}
            <span className="text-gray-400 text-sm ml-2">({rating}/5)</span>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div>
              {discount > 0 ? (
                <>
                  <span className="text-2xl font-bold text-white">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-gray-400 line-through ml-2">
                    ${price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-white">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-steam-accent hover:bg-blue-500 text-white px-4 py-2 rounded-md font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <FaShoppingCart />
              <span>Add</span>
            </button>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-steam-blue text-xs text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 p-4 flex flex-col justify-center items-center"
          >
            <h3 className="text-white text-xl font-bold mb-2 text-center">
              {game.title}
            </h3>
            <p className="text-gray-300 text-sm text-center mb-4 line-clamp-3">
              {game.description}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="bg-steam-accent hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold transition-all"
              >
                <FaShoppingCart className="inline mr-2" />
                Quick Buy
              </button>
              <button
                onClick={handleViewDetails}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-semibold transition-all"
              >
                <FaEye className="inline mr-2" />
                View Details
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Game Detail Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-steam-dark rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative h-64 md:h-80">
                <img
                  src={game.image_url}
                  alt={game.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400/1b2838/ffffff?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Header Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {game.title}
                      </h2>
                      <div className="flex items-center gap-4">
                        {discount > 0 && (
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            -{discount}% OFF
                          </span>
                        )}
                        <span className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-sm">
                          {game.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-sm">
                          {game.platform}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleShareGame}
                        className="p-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-full"
                        title="Share"
                      >
                        <FaShareAlt />
                      </button>
                      <button
                        onClick={handleWishlistToggle}
                        className={`p-2 rounded-full ${
                          isInWishlist
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-800/50 hover:bg-gray-700/50 text-white'
                        }`}
                        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <FaHeart />
                      </button>
                      <button
                        onClick={handleCloseModal}
                        className="p-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-full"
                        title="Close"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto max-h-[calc(90vh-16rem)]">
                <div className="p-6 md:p-8">
                  {/* Price and Action Section */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-4 bg-steam-blue/10 rounded-xl">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-baseline gap-2">
                        {discount > 0 ? (
                          <>
                            <span className="text-4xl font-bold text-white">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-xl text-gray-400 line-through">
                              ${price.toFixed(2)}
                            </span>
                            <span className="text-green-400 font-bold">
                              Save ${(price - discountedPrice).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-4xl font-bold text-white">
                            ${price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-gray-800 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange('decrease')}
                          className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50"
                          disabled={quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="px-4 py-2 text-white font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange('increase')}
                          className="px-4 py-2 text-gray-400 hover:text-white"
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        className="bg-gradient-to-r from-steam-accent to-blue-600 hover:from-blue-600 hover:to-steam-accent text-white px-8 py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30"
                      >
                        <FaShoppingCart />
                        Add to Cart - ${(discountedPrice * quantity).toFixed(2)}
                      </button>
                    </div>
                  </div>

                  {/* Game Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-white mb-4">About This Game</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {game.description || "No description available."}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-3">Game Details</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <FaStar className="text-yellow-400" />
                            <div>
                              <div className="text-gray-400 text-sm">Rating</div>
                              <div className="text-white">
                                {rating}/5 {[...Array(rating)].map(() => '★').join('')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <FaCalendar className="text-blue-400" />
                            <div>
                              <div className="text-gray-400 text-sm">Release Date</div>
                              <div className="text-white">
                                {new Date(game.release_date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <FaBuilding className="text-green-400" />
                            <div>
                              <div className="text-gray-400 text-sm">Developer</div>
                              <div className="text-white">{game.developer}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <FaShoppingBag className="text-purple-400" />
                            <div>
                              <div className="text-gray-400 text-sm">Publisher</div>
                              <div className="text-white">{game.publisher}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <FaGamepad className="text-red-400" />
                            <div>
                              <div className="text-gray-400 text-sm">Age Rating</div>
                              <div className="text-white">{ageRating}+</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  {tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-white mb-4">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-steam-blue/30 text-gray-300 rounded-full flex items-center gap-2"
                          >
                            <FaTag className="text-xs" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Screenshots Gallery */}
                  {screenshots.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-white mb-4">Screenshots</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {screenshots.slice(0, 6).map((screenshot, index) => (
                          <div
                            key={index}
                            className="rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => window.open(screenshot, '_blank')}
                          >
                            <img
                              src={screenshot}
                              alt={`${game.title} screenshot ${index + 1}`}
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x200/1b2838/ffffff?text=Screenshot';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* System Requirements (Optional) */}
                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Platform</h3>
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2 bg-steam-blue/30 text-white rounded-lg">
                        {game.platform}
                      </div>
                      {game.is_featured && (
                        <div className="px-4 py-2 bg-yellow-500/30 text-yellow-300 rounded-lg flex items-center gap-2">
                          <FaStar />
                          Featured
                        </div>
                      )}
                      {game.is_trending && (
                        <div className="px-4 py-2 bg-red-500/30 text-red-300 rounded-lg flex items-center gap-2">
                          <FaHeart />
                          Trending
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-800 p-4 bg-steam-dark">
                <div className="flex justify-between items-center">
                  <div className="text-gray-400 text-sm">
                    Game ID: {game.id} • {game.category}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                      <FaCheck />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameCard;