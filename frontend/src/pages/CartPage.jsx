import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useGameContext();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const formatPrice = (price) => {
    const num = Number(price) || 0;
    return num.toFixed(2);
  };

  // Helper untuk mendapatkan data game
  const getGameData = (item) => {
    // Handle jika game ada di dalam item.game atau langsung di item
    if (item.game) {
      return {
        id: item.game.id || item.id,
        title: item.game.title || item.title,
        price: parseFloat(item.game.price) || 0,
        discount: parseFloat(item.game.discount) || 0,
        image_url: item.game.image_url || item.image_url || 'https://via.placeholder.com/128x96/1b2838/ffffff?text=Game',
        quantity: item.quantity || 1
      };
    }
    return {
      id: item.id,
      title: item.title || 'Unknown Game',
      price: parseFloat(item.price) || 0,
      discount: parseFloat(item.discount) || 0,
      image_url: item.image_url || 'https://via.placeholder.com/128x96/1b2838/ffffff?text=Game',
      quantity: item.quantity || 1
    };
  };

  const handleQuantityChange = (item, newQuantity) => {
    const gameData = getGameData(item);
    if (newQuantity < 1) {
      removeFromCart(gameData.id);
      toast.success('Item removed from cart');
    } else {
      updateCartQuantity(gameData.id, newQuantity);
    }
  };

  const handleRemoveItem = (item) => {
    const gameData = getGameData(item);
    removeFromCart(gameData.id);
    toast.success(`${gameData.title} removed from cart`);
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    // Contoh promo codes
    const promoCodes = {
      'WELCOME10': 10,
      'GAMER20': 20,
      'STEAM30': 30
    };

    const discountPercent = promoCodes[promoCode.toUpperCase()];
    
    if (discountPercent) {
      setDiscount(discountPercent);
      toast.success(`Promo code applied! ${discountPercent}% discount`);
    } else {
      toast.error('Invalid promo code');
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => {
      const game = getGameData(item);
      const price = game.price;
      const quantity = game.quantity || 1;
      const finalPrice = price * (1 - (game.discount || 0) / 100);
      return total + (finalPrice * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1; // 10% tax
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + tax - discountAmount;

  const handleCheckout = () => {
    // Simulate checkout process
    toast.success('Redirecting to checkout...');
    // Di sini bisa redirect ke halaman checkout atau payment gateway
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-steam-darker pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-steam-blue/30 to-steam-accent/30 rounded-2xl p-12 text-center border border-white/10">
            <div className="text-8xl mb-8 opacity-50">🛒</div>
            <h2 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-md mx-auto">
              Looks like you haven't added any games to your cart yet. Start exploring our collection!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/games"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-steam-accent to-blue-600 hover:from-blue-600 hover:to-steam-accent text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/30"
              >
                <FaShoppingCart />
                Browse All Games
              </Link>
              <Link
                to="/games?onSale=true"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-green-500/30"
              >
                🎮 View On Sale Games
              </Link>
            </div>
          </div>

          {/* Featured Games Suggestion */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Popular Games You Might Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Cyberpunk 2077', price: 59.99, discount: 20, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop' },
                { title: 'Elden Ring', price: 59.99, discount: 15, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w-300&h=200&fit=crop' },
                { title: 'The Witcher 3', price: 39.99, discount: 30, image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=300&h=200&fit=crop' }
              ].map((game, index) => (
                <div key={index} className="bg-steam-dark rounded-xl p-4 border border-white/5 hover:border-steam-accent/50 transition-all">
                  <img src={game.image} alt={game.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                  <h4 className="text-white font-bold mb-2">{game.title}</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">${(game.price * (1 - game.discount / 100)).toFixed(2)}</span>
                      <span className="text-gray-400 line-through ml-2">${game.price.toFixed(2)}</span>
                    </div>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">-{game.discount}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steam-darker pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Shopping Cart</h1>
          <p className="text-gray-400 text-lg">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const game = getGameData(item);
              const finalPrice = game.price * (1 - game.discount / 100);
              const itemTotal = finalPrice * game.quantity;

              return (
                <motion.div
                  key={`${game.id}-${game.quantity}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-steam-dark/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Game Image */}
                    <div className="sm:w-48 flex-shrink-0">
                      <img
                        src={game.image_url}
                        alt={game.title}
                        className="w-full h-36 object-cover rounded-xl"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/192x144/1b2838/ffffff?text=Game';
                        }}
                      />
                      {game.discount > 0 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                          -{game.discount}%
                        </div>
                      )}
                    </div>

                    {/* Game Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-2xl font-bold text-white">
                              ${formatPrice(finalPrice)}
                            </div>
                            {game.discount > 0 && (
                              <div className="text-gray-400 line-through">
                                ${formatPrice(game.price)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white rounded-lg transition-all"
                          title="Remove from cart"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-gray-900 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item, game.quantity - 1)}
                              className="p-3 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                              disabled={game.quantity <= 1}
                            >
                              <FaMinus />
                            </button>
                            <span className="w-12 text-center text-white font-bold text-lg">
                              {game.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, game.quantity + 1)}
                              className="p-3 text-gray-400 hover:text-white"
                            >
                              <FaPlus />
                            </button>
                          </div>
                          
                          <div className="text-gray-400 text-sm">
                            {game.quantity} × ${formatPrice(finalPrice)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            ${formatPrice(itemTotal)}
                          </div>
                          <div className="text-gray-400 text-sm">
                            Item total
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={clearCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white rounded-xl font-semibold transition-all"
              >
                <FaTrash />
                Clear Entire Cart
              </button>
              <Link
                to="/games"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all text-center"
              >
                <FaShoppingCart />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-steam-dark/50 border border-white/10 rounded-2xl p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>
              
              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal ({cart.items.length} items)</span>
                  <span className="text-white font-medium">${formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Tax (10%)</span>
                  <span className="text-white font-medium">${formatPrice(tax)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount ({discount}%)</span>
                    <span className="text-green-400 font-medium">-${formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4 mt-2">
                  <div className="flex justify-between">
                    <span className="text-white text-lg font-bold">Total</span>
                    <span className="text-3xl font-bold text-white">${formatPrice(total)}</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    Including tax and discounts
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 bg-gray-900 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-steam-accent"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-6 py-3 bg-steam-accent hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {discount === 0 && promoCode && (
                  <div className="text-yellow-400 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle />
                    Try: WELCOME10, GAMER20, STEAM30
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-3"
              >
                Proceed to Checkout
                <FaArrowRight />
              </button>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-gray-400 text-sm text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Secure checkout • Encrypted payment
                  </div>
                  <p>All transactions are secure and encrypted</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-steam-dark/50 border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-bold mb-4">Accepted Payment Methods</h4>
              <div className="flex flex-wrap gap-3">
                {['💳 Credit/Debit', '🏦 Bank Transfer', '📱 E-Wallet', '🎮 Steam Wallet'].map((method) => (
                  <span key={method} className="px-3 py-2 bg-gray-900/50 text-gray-300 rounded-lg text-sm">
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-bold mb-2">Need Help?</h4>
              <p className="text-gray-400 text-sm mb-4">
                Contact our support team for assistance with your order.
              </p>
              <button className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;