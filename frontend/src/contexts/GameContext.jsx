import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

const API_BASE = 'http://127.0.0.1:8000/api';

// Helper function untuk parse tags
const parseTags = (tags) => {
  try {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (e) {
    console.error('Error parsing tags:', e);
    return [];
  }
};

// Helper function untuk parse game data
const parseGameData = (game) => {
  if (!game) return null;
  
  return {
    id: game.id || Math.random().toString(36).substr(2, 9),
    title: game.title || 'Unknown Game',
    description: game.description || '',
    price: parseFloat(game.price) || 0,
    discount: parseFloat(game.discount) || 0,
    rating: parseInt(game.rating) || 0,
    category: game.category || 'Other',
    platform: game.platform || 'PC',
    developer: game.developer || 'Unknown',
    publisher: game.publisher || 'Unknown',
    release_date: game.release_date || new Date().toISOString(),
    image_url: game.image_url || 'https://via.placeholder.com/300x200/1b2838/ffffff?text=Game',
    screenshots: parseTags(game.screenshots),
    video_url: game.video_url || '',
    tags: parseTags(game.tags),
    age_rating: parseInt(game.age_rating) || 18,
    is_featured: Boolean(game.is_featured),
    is_trending: Boolean(game.is_trending)
  };
};

export const GameProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [featuredGames, setFeaturedGames] = useState([]);
    const [trendingGames, setTrendingGames] = useState([]);
    const [onSaleGames, setOnSaleGames] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        onSale: false,
        sort: 'latest'
    });
    
    // Gunakan localStorage untuk cart dan wishlist (tanpa login)
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : { items: [], total: 0, totalItems: 0 };
    });
    
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    // Sync cart dan wishlist ke localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    // Helper function untuk update cart total
    const calculateCartTotal = (items) => {
        const total = items.reduce((sum, item) => {
            const gamePrice = item.game?.price || item.price || 0;
            const gameDiscount = item.game?.discount || item.discount || 0;
            const finalPrice = gamePrice * (1 - gameDiscount / 100);
            return sum + (finalPrice * item.quantity);
        }, 0);
        
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        
        return { total, totalItems };
    };

    // Fetch all games
    const fetchGames = async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.category) queryParams.append('category', params.category);
            if (params.minPrice) queryParams.append('min_price', params.minPrice);
            if (params.maxPrice) queryParams.append('max_price', params.maxPrice);
            if (params.onSale) queryParams.append('on_sale', 'true');
            if (params.sort) queryParams.append('sort', params.sort);
            if (params.search) queryParams.append('search', params.search);
            
            const response = await fetch(`${API_BASE}/games?${queryParams.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch games: ${response.status}`);
            }

            const data = await response.json();
            
            let normalized;
            if (data && typeof data === 'object') {
                if (Array.isArray(data)) {
                    normalized = data;
                } else if (data.data && Array.isArray(data.data)) {
                    normalized = data.data;
                } else {
                    normalized = [];
                }
            } else {
                normalized = [];
            }
            
            const parsedGames = normalized.map(game => parseGameData(game)).filter(Boolean);
            setGames(parsedGames);
            
        } catch (error) {
            console.error('Error fetching games:', error);
            toast.error('Failed to load games');
            setGames(getDummyGames());
        }
    };

    // Fetch featured games
    const fetchFeaturedGames = async () => {
        try {
            const response = await fetch(`${API_BASE}/games/featured`);
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            const normalized = Array.isArray(data) ? data : data.data || [];
            const parsedGames = normalized.map(game => parseGameData(game)).filter(Boolean);
            setFeaturedGames(parsedGames);
        } catch (error) {
            console.error('Error fetching featured games:', error);
            setFeaturedGames(getDummyGames().slice(0, 3));
        }
    };

    // Fetch trending games
    const fetchTrendingGames = async () => {
        try {
            const response = await fetch(`${API_BASE}/games/trending`);
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            const normalized = Array.isArray(data) ? data : data.data || [];
            const parsedGames = normalized.map(game => parseGameData(game)).filter(Boolean);
            setTrendingGames(parsedGames);
        } catch (error) {
            console.error('Error fetching trending games:', error);
            setTrendingGames(getDummyGames().slice(0, 4));
        }
    };

    // Fetch on sale games
    const fetchOnSaleGames = async () => {
        try {
            const response = await fetch(`${API_BASE}/games/on-sale`);
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            const normalized = Array.isArray(data) ? data : data.data || [];
            const parsedGames = normalized.map(game => parseGameData(game)).filter(Boolean);
            setOnSaleGames(parsedGames);
        } catch (error) {
            console.error('Error fetching on sale games:', error);
            setOnSaleGames(getDummyGames().filter(g => g.discount > 0));
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE}/games/categories`);
            if (!response.ok) throw new Error(await response.text());
            let data = await response.json();
            
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                data = data.data || Object.values(data);
            }
            
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories(['RPG', 'Action', 'Adventure', 'Strategy', 'Sports', 'Simulation']);
        }
    };

    // Add to cart (tanpa login)
    const addToCart = async (game, quantity = 1) => {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            
            if (token) {
                // If logged in, sync with backend
                const response = await fetch(`${API_BASE}/cart/add/${game.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ quantity })
                });

                if (response.ok) {
                    const updatedCart = await response.json();
                    setCart(updatedCart);
                    toast.success(`${game.title} added to cart`);
                    return;
                }
            }
            
            // If not logged in or API failed, use localStorage
            const existingItemIndex = cart.items.findIndex(item => item.game?.id === game.id || item.id === game.id);
            
            if (existingItemIndex >= 0) {
                // Update quantity if item already exists
                const updatedItems = [...cart.items];
                updatedItems[existingItemIndex].quantity += quantity;
                
                const { total, totalItems } = calculateCartTotal(updatedItems);
                const newCart = { items: updatedItems, total, totalItems };
                setCart(newCart);
            } else {
                // Add new item to cart
                const newItem = {
                    id: `local_${Date.now()}`,
                    game: parseGameData(game),
                    quantity,
                    price: game.price,
                    discount: game.discount
                };
                
                const updatedItems = [...cart.items, newItem];
                const { total, totalItems } = calculateCartTotal(updatedItems);
                const newCart = { items: updatedItems, total, totalItems };
                setCart(newCart);
            }
            
            toast.success(`${game.title} added to cart`);
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        }
    };

    // Remove from cart (tanpa login)
    const removeFromCart = async (cartItemId) => {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            
            if (token) {
                // If logged in, sync with backend
                const response = await fetch(`${API_BASE}/cart/remove/${cartItemId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const updatedCart = await response.json();
                    setCart(updatedCart);
                    toast.success('Item removed from cart');
                    return;
                }
            }
            
            // If not logged in or API failed, use localStorage
            const updatedItems = cart.items.filter(item => 
                item.id !== cartItemId && 
                (item.game?.id !== cartItemId && item.id !== `local_${cartItemId}`)
            );
            
            const { total, totalItems } = calculateCartTotal(updatedItems);
            const newCart = { items: updatedItems, total, totalItems };
            setCart(newCart);
            
            toast.success('Item removed from cart');
            
        } catch (error) {
            console.error('Error removing from cart:', error);
            toast.error('Failed to remove item from cart');
        }
    };

    // Update cart quantity (tanpa login)
    const updateCartQuantity = async (cartItemId, quantity) => {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            
            if (token) {
                // If logged in, sync with backend
                const response = await fetch(`${API_BASE}/cart/update/${cartItemId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ quantity })
                });

                if (response.ok) {
                    const updatedCart = await response.json();
                    setCart(updatedCart);
                    return;
                }
            }
            
            // If not logged in or API failed, use localStorage
            const updatedItems = cart.items.map(item => {
                if (item.id === cartItemId || item.game?.id === cartItemId) {
                    return { ...item, quantity: Math.max(1, quantity) };
                }
                return item;
            });
            
            const { total, totalItems } = calculateCartTotal(updatedItems);
            const newCart = { items: updatedItems, total, totalItems };
            setCart(newCart);
            
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    // Clear cart (tanpa login)
    const clearCart = async () => {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            
            if (token) {
                // If logged in, sync with backend
                const response = await fetch(`${API_BASE}/cart/clear`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    setCart({ items: [], total: 0, totalItems: 0 });
                    toast.success('Cart cleared');
                    return;
                }
            }
            
            // If not logged in or API failed, use localStorage
            setCart({ items: [], total: 0, totalItems: 0 });
            toast.success('Cart cleared');
            
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
        }
    };

    // Toggle wishlist (tanpa login)
    const toggleWishlist = async (game) => {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            
            if (token) {
                // If logged in, sync with backend
                const response = await fetch(`${API_BASE}/wishlist/toggle/${game.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.added) {
                        toast.success('Added to wishlist');
                        setWishlist(prev => [...prev, game]);
                    } else {
                        toast.success('Removed from wishlist');
                        setWishlist(prev => prev.filter(item => item.id !== game.id));
                    }
                    return;
                }
            }
            
            // If not logged in or API failed, use localStorage
            const isInWishlist = wishlist.some(item => item.id === game.id);
            
            if (isInWishlist) {
                // Remove from wishlist
                const updatedWishlist = wishlist.filter(item => item.id !== game.id);
                setWishlist(updatedWishlist);
                toast.success('Removed from wishlist');
            } else {
                // Add to wishlist
                const updatedWishlist = [...wishlist, game];
                setWishlist(updatedWishlist);
                toast.success('Added to wishlist');
            }
            
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    // Check if game is in wishlist (tanpa login)
    const checkWishlist = async (gameId) => {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            
            if (token) {
                // If logged in, check with backend
                const response = await fetch(`${API_BASE}/wishlist/check/${gameId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    return result.in_wishlist || false;
                }
            }
            
            // If not logged in or API failed, check localStorage
            return wishlist.some(item => item.id === gameId);
            
        } catch (error) {
            console.error('Error checking wishlist:', error);
            return wishlist.some(item => item.id === gameId);
        }
    };

    // Apply filters
    const applyFilters = (newFilters) => {
        setFilters(newFilters);
        fetchGames(newFilters);
    };

    // Fetch cart from localStorage (tanpa login)
    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (token) {
                // If logged in, fetch from backend
                const response = await fetch(`${API_BASE}/cart`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setCart(data);
                    return;
                } else if (response.status === 401) {
                    // Token invalid/expired
                    localStorage.removeItem('token');
                    // Keep localStorage cart
                }
            }
            
            // If not logged in or API failed, use localStorage
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
            
        } catch (error) {
            console.error('Error fetching cart:', error);
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        }
    };

    // Sync cart with backend when user logs in
    const syncCartWithBackend = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
            // Get current localStorage cart
            const localCart = JSON.parse(localStorage.getItem('cart') || '{"items": []}');
            
            if (localCart.items.length > 0) {
                // Sync each item to backend
                for (const item of localCart.items) {
                    const gameId = item.game?.id || item.id;
                    if (gameId && !gameId.startsWith('local_')) {
                        await fetch(`${API_BASE}/cart/add/${gameId}`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({ quantity: item.quantity })
                        });
                    }
                }
                
                // Clear localStorage cart after sync
                localStorage.removeItem('cart');
                
                // Fetch updated cart from backend
                await fetchCart();
            }
        } catch (error) {
            console.error('Error syncing cart:', error);
        }
    };

    // Sync wishlist with backend when user logs in
    const syncWishlistWithBackend = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
            // Get current localStorage wishlist
            const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            
            if (localWishlist.length > 0) {
                // Sync each item to backend
                for (const game of localWishlist) {
                    if (game.id && !game.id.startsWith('local_')) {
                        await fetch(`${API_BASE}/wishlist/toggle/${game.id}`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'application/json'
                            }
                        });
                    }
                }
                
                // Clear localStorage wishlist after sync
                localStorage.removeItem('wishlist');
                
                // Fetch updated wishlist from backend
                const response = await fetch(`${API_BASE}/wishlist`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setWishlist(Array.isArray(data) ? data : data.data || []);
                }
            }
        } catch (error) {
            console.error('Error syncing wishlist:', error);
        }
    };

    // Initialize data
    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchGames(),
                    fetchFeaturedGames(),
                    fetchTrendingGames(),
                    fetchOnSaleGames(),
                    fetchCategories(),
                    fetchCart()
                ]);
            } catch (error) {
                console.error('Error initializing data:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    // Listen for login/logout events
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token' && e.newValue) {
                // User logged in - sync data with backend
                syncCartWithBackend();
                syncWishlistWithBackend();
            } else if (e.key === 'token' && !e.newValue) {
                // User logged out - keep localStorage data
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    setCart(JSON.parse(savedCart));
                }
                
                const savedWishlist = localStorage.getItem('wishlist');
                if (savedWishlist) {
                    setWishlist(JSON.parse(savedWishlist));
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const value = {
        games,
        featuredGames,
        trendingGames,
        onSaleGames,
        categories,
        cart,
        wishlist,
        loading,
        filters,
        fetchGames,
        applyFilters,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        checkWishlist,
        fetchCart,
        syncCartWithBackend,
        syncWishlistWithBackend
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};