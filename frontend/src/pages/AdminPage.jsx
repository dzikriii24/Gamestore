import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaImage, 
  FaTag, FaCalendar, FaStar, FaGamepad, FaBuilding, FaUpload,
  FaLock, FaExclamationTriangle, FaSync, FaFilter
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [games, setGames] = useState([]);
  const [editingGame, setEditingGame] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const initialGameState = {
    title: '',
    description: '',
    price: '',
    discount: '0',
    rating: '5',
    category: '',
    platform: 'PC',
    developer: '',
    publisher: '',
    release_date: new Date().toISOString().split('T')[0],
    image_url: '',
    tags: '',
    age_rating: '18',
    is_featured: false,
    is_trending: false,
    video_url: '',
    screenshots: ''
  };

  const [newGame, setNewGame] = useState(initialGameState);

  // Cek autentikasi saat komponen dimount
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('admin_authenticated');
      const authTime = localStorage.getItem('admin_auth_time');
      
      // Cek jika sudah lebih dari 2 jam (7200000 ms)
      if (authStatus !== 'true' || 
          (authTime && Date.now() - parseInt(authTime) > 7200000)) {
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_auth_time');
        setShowAuthModal(true);
      } else {
        setIsAuthenticated(true);
        fetchGames();
        fetchCategories();
      }
    };
    
    checkAuth();
  }, []);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    
    if (authCode === '123123') {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_auth_time', Date.now().toString());
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setAuthCode('');
      toast.success('Admin login successful!');
      fetchGames();
      fetchCategories();
    } else {
      toast.error('Invalid admin code!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_auth_time');
    setIsAuthenticated(false);
    setShowAuthModal(true);
    toast.success('Logged out successfully!');
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Token user biasa
      const headers = {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      let url = 'http://localhost:8000/api/games';
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      let gamesData = [];
      if (Array.isArray(data)) {
        gamesData = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
        gamesData = data.data;
      } else if (data && typeof data === 'object') {
        gamesData = Object.values(data);
      }
      
      setGames(gamesData);
      
    } catch (error) {
      console.error('Error fetching games:', error);
      toast.error('Failed to load games');
      // Fallback ke dummy data untuk development
      setGames([
        {
          id: 1,
          title: 'Cyberpunk 2077',
          description: 'An open-world RPG',
          price: 59.99,
          discount: 20,
          rating: 4,
          category: 'RPG',
          platform: 'PC',
          developer: 'CD Projekt Red',
          publisher: 'CD Projekt',
          release_date: '2020-12-10',
          image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          tags: ['Open World', 'Cyberpunk'],
          age_rating: 18,
          is_featured: true,
          is_trending: true
        },
        {
          id: 2,
          title: 'Elden Ring',
          description: 'A fantasy action-RPG',
          price: 59.99,
          discount: 15,
          rating: 5,
          category: 'Action RPG',
          platform: 'Multi-platform',
          developer: 'FromSoftware',
          publisher: 'Bandai Namco',
          release_date: '2022-02-25',
          image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
          tags: ['Fantasy', 'Souls-like'],
          age_rating: 16,
          is_featured: true,
          is_trending: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/games/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      
      let categoriesData = [];
      if (Array.isArray(data)) {
        categoriesData = data;
      } else if (data && typeof data === 'object') {
        categoriesData = data.data || Object.values(data);
      }
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(['RPG', 'Action', 'Adventure', 'Strategy', 'Simulation', 'Sports', 'Racing', 'Puzzle', 'FPS', 'Indie']);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (editingGame) {
      setEditingGame({ 
        ...editingGame, 
        [name]: type === 'checkbox' ? checked : value 
      });
    } else {
      setNewGame({ 
        ...newGame, 
        [name]: type === 'checkbox' ? checked : value 
      });
    }
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    
    try {
      // Cek autentikasi admin
      const adminAuth = localStorage.getItem('admin_authenticated');
      if (adminAuth !== 'true') {
        toast.error('Please login as admin first!');
        setShowAuthModal(true);
        return;
      }

      // Get user token (untuk API authorization)
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        toast.error('Please login as a user first');
        navigate('/login');
        return;
      }

      // Prepare game data
      const gameData = {
        title: newGame.title,
        description: newGame.description,
        price: parseFloat(newGame.price) || 0,
        discount: parseFloat(newGame.discount) || 0,
        rating: parseInt(newGame.rating) || 5,
        category: newGame.category,
        platform: newGame.platform,
        developer: newGame.developer,
        publisher: newGame.publisher,
        release_date: newGame.release_date,
        image_url: newGame.image_url,
        tags: newGame.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        age_rating: parseInt(newGame.age_rating) || 18,
        is_featured: Boolean(newGame.is_featured),
        is_trending: Boolean(newGame.is_trending),
        video_url: newGame.video_url || '',
        screenshots: newGame.screenshots ? newGame.screenshots.split(',').map(url => url.trim()).filter(url => url) : []
      };

      console.log('Sending game data:', gameData);

      const response = await fetch('http://localhost:8000/api/games', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`, // Token user untuk API
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(gameData)
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Game added successfully!');
        setIsAdding(false);
        setNewGame(initialGameState);
        fetchGames();
      } else {
        // Jika unauthorized, mungkin butuh admin token khusus
        if (response.status === 401 || response.status === 403) {
          toast.error('Admin privileges required. Please contact administrator.');
        } else {
          toast.error(result.message || 'Failed to add game');
        }
        console.error('Server error:', result);
      }
    } catch (error) {
      console.error('Error adding game:', error);
      toast.error('Network error: Failed to add game');
    }
  };

  const handleUpdateGame = async () => {
    try {
      // Cek autentikasi admin
      const adminAuth = localStorage.getItem('admin_authenticated');
      if (adminAuth !== 'true') {
        toast.error('Please login as admin first!');
        setShowAuthModal(true);
        return;
      }

      // Get user token
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        toast.error('Please login as a user first');
        navigate('/login');
        return;
      }

      // Prepare update data
      const updateData = {
        title: editingGame.title,
        description: editingGame.description,
        price: parseFloat(editingGame.price) || 0,
        discount: parseFloat(editingGame.discount) || 0,
        rating: parseInt(editingGame.rating) || 5,
        category: editingGame.category,
        platform: editingGame.platform,
        developer: editingGame.developer,
        publisher: editingGame.publisher,
        release_date: editingGame.release_date,
        image_url: editingGame.image_url,
        tags: typeof editingGame.tags === 'string' 
          ? editingGame.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : editingGame.tags,
        age_rating: parseInt(editingGame.age_rating) || 18,
        is_featured: Boolean(editingGame.is_featured),
        is_trending: Boolean(editingGame.is_trending),
        video_url: editingGame.video_url || '',
        screenshots: editingGame.screenshots 
          ? (typeof editingGame.screenshots === 'string' 
              ? editingGame.screenshots.split(',').map(url => url.trim()).filter(url => url)
              : editingGame.screenshots)
          : []
      };

      const response = await fetch(`http://localhost:8000/api/games/${editingGame.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Game updated successfully!');
        setEditingGame(null);
        fetchGames();
      } else {
        if (response.status === 401 || response.status === 403) {
          toast.error('Admin privileges required. Please contact administrator.');
        } else {
          toast.error(result.message || 'Failed to update game');
        }
      }
    } catch (error) {
      console.error('Error updating game:', error);
      toast.error('Failed to update game');
    }
  };

  const handleDeleteGame = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return;
    }

    try {
      // Cek autentikasi admin
      const adminAuth = localStorage.getItem('admin_authenticated');
      if (adminAuth !== 'true') {
        toast.error('Please login as admin first!');
        setShowAuthModal(true);
        return;
      }

      // Get user token
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        toast.error('Please login as a user first');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/games/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Game deleted successfully!');
        fetchGames();
      } else {
        const result = await response.json();
        if (response.status === 401 || response.status === 403) {
          toast.error('Admin privileges required. Please contact administrator.');
        } else {
          toast.error(result.message || 'Failed to delete game');
        }
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      toast.error('Failed to delete game');
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchGames();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    fetchGames();
  };

  const platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Multi-platform'];
  const ageRatings = ['3', '7', '12', '16', '18'];

  // Render auth modal jika belum login sebagai admin
  if (showAuthModal) {
    return (
      <div className="min-h-screen bg-steam-darker flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full mb-4">
                <FaLock className="text-2xl text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Access Required</h1>
              <p className="text-gray-400">Enter admin code to access the dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Admin Code
                </label>
                <input
                  type="password"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="Enter 6-digit admin code"
                  className="w-full bg-gray-900/50 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  maxLength="6"
                  required
                  autoFocus
                />
              </div>

              {/* Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-lg">
                <p className="text-sm">
                  <strong className="font-semibold">Info:</strong> Admin code is <span className="font-mono bg-gray-800/50 px-2 py-1 rounded">123123</span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Back to Home
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-red-500/20"
                >
                  Access Admin Panel
                </button>
              </div>
            </form>

            {/* Security Warning */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-center text-xs text-gray-500">
                ⚠️ This page is for authorized administrators only.
                <br />
                Do not share the admin code with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-steam-darker">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-steam-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steam-darker p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-300">Manage your game store inventory and settings</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white rounded-lg transition-all"
              >
                <FaLock />
                Logout Admin
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-steam-blue/30 rounded-lg">
                <span className="text-gray-400">Total Games: </span>
                <span className="text-white font-bold text-lg">{games.length}</span>
              </div>
              <div className="px-4 py-2 bg-green-500/20 rounded-lg">
                <span className="text-gray-400">Featured: </span>
                <span className="text-green-300 font-bold text-lg">
                  {games.filter(g => g.is_featured).length}
                </span>
              </div>
              <div className="px-4 py-2 bg-red-500/20 rounded-lg">
                <span className="text-gray-400">Trending: </span>
                <span className="text-red-300 font-bold text-lg">
                  {games.filter(g => g.is_trending).length}
                </span>
              </div>
            </div>
            
            <div className="text-sm text-gray-400 ml-auto">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Admin Mode Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-steam-dark border border-white/10 rounded-2xl p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search games..."
                  className="flex-1 bg-gray-900 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-steam-accent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-steam-accent hover:bg-blue-600 text-white rounded-lg"
                >
                  <FaFilter />
                </button>
              </form>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-900 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-steam-accent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
              >
                Clear
              </button>
              
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold"
              >
                <FaPlus />
                Add Game
              </button>
            </div>
          </div>
        </div>

        {/* Add Game Form */}
        {isAdding && (
          <div className="bg-steam-mid border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Add New Game</h3>
                <p className="text-gray-400 text-sm mt-1">Fill in the game details below</p>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400 text-xl" />
              </button>
            </div>

            <form onSubmit={handleAddGame} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    <FaGamepad className="inline mr-2" />
                    Game Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newGame.title}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent transition-colors"
                    placeholder="Enter game title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={newGame.price}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                    placeholder="59.99"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={newGame.discount}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                    placeholder="0-100"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={newGame.category}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Platform *
                  </label>
                  <select
                    name="platform"
                    value={newGame.platform}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                    required
                  >
                    {platforms.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    <FaStar className="inline mr-2" />
                    Rating (1-5)
                  </label>
                  <select
                    name="rating"
                    value={newGame.rating}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Star{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    <FaBuilding className="inline mr-2" />
                    Developer *
                  </label>
                  <input
                    type="text"
                    name="developer"
                    value={newGame.developer}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                    placeholder="Game developer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Publisher
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={newGame.publisher}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                    placeholder="Game publisher"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    <FaCalendar className="inline mr-2" />
                    Release Date
                  </label>
                  <input
                    type="date"
                    name="release_date"
                    value={newGame.release_date}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Age Rating
                  </label>
                  <select
                    name="age_rating"
                    value={newGame.age_rating}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                  >
                    {ageRatings.map((age) => (
                      <option key={age} value={age}>
                        {age}+
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    <FaImage className="inline mr-2" />
                    Cover Image URL *
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    value={newGame.image_url}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                    placeholder="https://example.com/game-cover.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    <FaTag className="inline mr-2" />
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={newGame.tags}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                    placeholder="RPG, Open World, Adventure"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={newGame.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent resize-none"
                  placeholder="Enter game description..."
                  required
                />
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Video URL (Trailer)
                  </label>
                  <input
                    type="url"
                    name="video_url"
                    value={newGame.video_url}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium">
                    Screenshots (comma separated URLs)
                  </label>
                  <input
                    type="text"
                    name="screenshots"
                    value={newGame.screenshots}
                    onChange={handleInputChange}
                    className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                    placeholder="https://example.com/screenshot1.jpg, https://..."
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={newGame.is_featured}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-steam-accent rounded focus:ring-steam-accent focus:ring-2 bg-steam-dark border-white/10"
                  />
                  <span className="text-white font-medium">Featured Game</span>
                  <span className="text-gray-400 text-sm">(Show on homepage)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_trending"
                    checked={newGame.is_trending}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-steam-accent rounded focus:ring-steam-accent focus:ring-2 bg-steam-dark border-white/10"
                  />
                  <span className="text-white font-medium">Trending Game</span>
                  <span className="text-gray-400 text-sm">(Show in trending section)</span>
                </label>
              </div>

              {/* Warning Box */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Note: You need to be logged in as a regular user to add games.</p>
                    <p className="text-sm mt-1">Admin code only grants access to this panel. Game operations require user authentication.</p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-steam-accent to-blue-600 hover:from-blue-600 hover:to-steam-accent text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30"
                >
                  <FaSave />
                  Add Game
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Games Table */}
        <div className="bg-steam-mid border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">Game Inventory</h3>
                <p className="text-gray-400 text-sm mt-1">Manage all games in your store</p>
              </div>
              <button
                onClick={fetchGames}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <FaSync />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-steam-dark/50 text-left">
                  <th className="p-4 text-gray-400 font-medium">Game</th>
                  <th className="p-4 text-gray-400 font-medium">Category</th>
                  <th className="p-4 text-gray-400 font-medium">Price</th>
                  <th className="p-4 text-gray-400 font-medium">Status</th>
                  <th className="p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center">
                      <div className="text-gray-500 text-lg">No games found</div>
                      <button
                        onClick={() => setIsAdding(true)}
                        className="mt-4 text-steam-accent hover:text-blue-400 font-medium"
                      >
                        Add your first game
                      </button>
                    </td>
                  </tr>
                ) : (
                  games.map((game) => (
                    <tr 
                      key={game.id} 
                      className="border-b border-white/5 hover:bg-white/2 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={game.image_url || 'https://via.placeholder.com/60x80/1b2838/ffffff?text=Game'}
                            alt={game.title}
                            className="w-16 h-20 object-cover rounded-lg"
                          />
                          <div>
                            <div className="font-semibold text-white">{game.title}</div>
                            <div className="text-sm text-gray-400 mt-1">{game.developer}</div>
                            <div className="flex items-center gap-2 mt-2">
                              {game.is_featured && (
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">
                                  Featured
                                </span>
                              )}
                              {game.is_trending && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                                  Trending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1.5 bg-steam-dark text-gray-300 rounded-lg text-sm">
                          {game.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">${parseFloat(game.price || 0).toFixed(2)}</div>
                        {game.discount > 0 && (
                          <div className="text-sm text-green-400">
                            -{game.discount}% OFF
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className={`w-3 h-3 rounded-full ${
                            game.release_date ? 
                              (new Date(game.release_date) > new Date() ? 'bg-yellow-500' : 'bg-green-500') 
                              : 'bg-gray-500'
                          }`}></div>
                          <div className="text-xs text-gray-400">
                            {game.release_date ? 
                              (new Date(game.release_date) > new Date() ? 'Upcoming' : 'Released') 
                              : 'Unknown'
                            }
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {editingGame?.id === game.id ? (
                            <>
                              <button
                                onClick={handleUpdateGame}
                                className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
                                title="Save changes"
                              >
                                <FaSave />
                              </button>
                              <button
                                onClick={() => setEditingGame(null)}
                                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                title="Cancel edit"
                              >
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingGame(game)}
                                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                                title="Edit game"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteGame(game.id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                                title="Delete game"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;