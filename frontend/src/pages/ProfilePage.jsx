import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaCalendar, FaGamepad, FaShoppingCart, FaHeart,
  FaEdit, FaSave, FaTimes, FaLock, FaCreditCard,
  FaHistory, FaStar, FaTrophy, FaCog, FaSignOutAlt,
  FaSteam, FaDiscord, FaTwitter, FaFacebook
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });

  // Dummy user data (bisa diganti dengan data dari API)
  const dummyUser = {
    id: 1,
    name: 'Dzikri Rabbani',
    email: 'dzikrirabbani2401@gmail.com',
    phone: '+62 851-5629-6580',
    address: 'Bandung, Indonesia',
    bio: 'Hardcore gamer yang suka RPG dan FPS. Selalu mencari game dengan cerita menarik dan gameplay yang menantang.',
    joinDate: '2023-01-15',
    avatar: 'https://i.pinimg.com/736x/b2/89/3a/b2893a230478bfc7fd8584e15130ef85.jpg',
    level: 1,
    xp: 8500,
    nextLevelXp: 10000,
    totalGames: 24,
    totalSpent: 489.99,
    wishlistCount: 12,
    cartCount: 3,
    badges: ['Early Adopter', 'Completionist', 'Collector', 'Reviewer'],
    favoriteGenres: ['RPG', 'FPS', 'Action', 'Adventure'],
    recentActivity: [
      { id: 1, type: 'purchase', game: 'Elden Ring', date: '2024-01-10', price: 59.99 },
      { id: 2, type: 'review', game: 'Cyberpunk 2077', date: '2024-01-08', rating: 4 },
      { id: 3, type: 'wishlist', game: 'Starfield', date: '2024-01-05' },
      { id: 4, type: 'achievement', text: 'Completed 100 hours', date: '2024-01-03' }
    ]
  };

  // Dummy orders
  const dummyOrders = [
    { id: 'ORD001', date: '2024-01-10', total: 89.98, status: 'completed', items: ['Elden Ring', 'Cyberpunk 2077'] },
    { id: 'ORD002', date: '2023-12-15', total: 29.99, status: 'completed', items: ['The Witcher 3'] },
    { id: 'ORD003', date: '2023-11-20', total: 49.99, status: 'completed', items: ['Red Dead Redemption 2'] },
    { id: 'ORD004', date: '2024-01-12', total: 19.99, status: 'pending', items: ['Stardew Valley'] }
  ];

  useEffect(() => {
    // Simulasi fetching user data
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Di sini bisa fetch dari API
        // const response = await fetch('/api/user');
        // const data = await response.json();
        
        // Untuk sekarang pakai dummy data
        setTimeout(() => {
          setUser(dummyUser);
          setEditForm({
            name: dummyUser.name,
            email: dummyUser.email,
            phone: dummyUser.phone,
            address: dummyUser.address,
            bio: dummyUser.bio
          });
          setOrders(dummyOrders);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Simulasi save ke API
    toast.success('Profile updated successfully!');
    setUser({
      ...user,
      ...editForm
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleChangePassword = () => {
    toast.success('Password change link sent to your email!');
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('admin_authenticated');
    toast.success('Logged out successfully!');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-steam-darker">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-steam-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steam-darker py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">My Profile</h1>
          <p className="text-gray-400 mt-2">Manage your account, games, and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-steam-mid border border-white/10 rounded-2xl overflow-hidden mb-6">
              {/* Profile Summary */}
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-steam-accent"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        Level {user.level}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">Member since {user.joinDate}</p>
                  
                  {/* XP Progress */}
                  <div className="w-full mt-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>XP: {user.xp}/{user.nextLevelXp}</span>
                      <span>{Math.round((user.xp / user.nextLevelXp) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                        style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 p-6 border-t border-white/5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.totalGames}</div>
                  <div className="text-gray-400 text-sm">Games Owned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">${user.totalSpent}</div>
                  <div className="text-gray-400 text-sm">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.wishlistCount}</div>
                  <div className="text-gray-400 text-sm">Wishlist</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.cartCount}</div>
                  <div className="text-gray-400 text-sm">In Cart</div>
                </div>
              </div>

              {/* Navigation */}
              <div className="border-t border-white/5">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-steam-blue text-white' 
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <FaUser />
                  <span>Profile</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-steam-blue text-white' 
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <FaShoppingCart />
                  <span>Purchase History</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    activeTab === 'wishlist' 
                      ? 'bg-steam-blue text-white' 
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <FaHeart />
                  <span>Wishlist</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-steam-blue text-white' 
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <FaCog />
                  <span>Settings</span>
                </button>
              </div>

              {/* Logout Button */}
              <div className="p-6 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white rounded-lg transition-all"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-steam-mid border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-300 rounded-full text-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 rounded-2xl p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                      <p className="text-gray-400">Manage your personal details</p>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-steam-accent hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        <FaEdit />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                          <FaTimes />
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                          <FaSave />
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="bg-steam-mid border border-white/10 rounded-2xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 mb-2">
                        <FaUser className="inline mr-2" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                        />
                      ) : (
                        <div className="text-white text-lg font-medium">{user.name}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">
                        <FaEnvelope className="inline mr-2" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                        />
                      ) : (
                        <div className="text-white text-lg font-medium">{user.email}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">
                        <FaPhone className="inline mr-2" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleInputChange}
                          className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                        />
                      ) : (
                        <div className="text-white text-lg font-medium">{user.phone}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">
                        <FaMapMarkerAlt className="inline mr-2" />
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={editForm.address}
                          onChange={handleInputChange}
                          className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent"
                        />
                      ) : (
                        <div className="text-white text-lg font-medium">{user.address}</div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-400 mb-2">Bio</label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={editForm.bio}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full bg-steam-dark text-white px-4 py-3 rounded-lg border border-white/5 focus:outline-none focus:border-steam-accent resize-none"
                        />
                      ) : (
                        <div className="text-white">{user.bio}</div>
                      )}
                    </div>
                  </div>

                  {/* Favorite Genres */}
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">Favorite Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.favoriteGenres.map((genre, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-lg"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-steam-mid border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {user.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-4 bg-steam-dark/50 rounded-lg">
                        <div className={`p-3 rounded-full ${
                          activity.type === 'purchase' ? 'bg-green-500/20' :
                          activity.type === 'review' ? 'bg-yellow-500/20' :
                          activity.type === 'wishlist' ? 'bg-red-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          {activity.type === 'purchase' && <FaShoppingCart className="text-green-400" />}
                          {activity.type === 'review' && <FaStar className="text-yellow-400" />}
                          {activity.type === 'wishlist' && <FaHeart className="text-red-400" />}
                          {activity.type === 'achievement' && <FaTrophy className="text-blue-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">
                            {activity.type === 'purchase' && `Purchased ${activity.game}`}
                            {activity.type === 'review' && `Reviewed ${activity.game}`}
                            {activity.type === 'wishlist' && `Added ${activity.game} to wishlist`}
                            {activity.type === 'achievement' && activity.text}
                          </div>
                          <div className="text-gray-400 text-sm">{activity.date}</div>
                          {activity.price && (
                            <div className="text-green-400 text-sm">${activity.price}</div>
                          )}
                          {activity.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`${i < activity.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-white/10 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white">Purchase History</h2>
                  <p className="text-gray-400">View and manage your game purchases</p>
                </div>

                <div className="bg-steam-mid border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-steam-dark/50 text-left">
                          <th className="p-4 text-gray-400 font-medium">Order ID</th>
                          <th className="p-4 text-gray-400 font-medium">Date</th>
                          <th className="p-4 text-gray-400 font-medium">Items</th>
                          <th className="p-4 text-gray-400 font-medium">Total</th>
                          <th className="p-4 text-gray-400 font-medium">Status</th>
                          <th className="p-4 text-gray-400 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-white/5 hover:bg-white/2">
                            <td className="p-4">
                              <div className="font-mono text-white font-medium">{order.id}</div>
                            </td>
                            <td className="p-4 text-gray-300">{order.date}</td>
                            <td className="p-4">
                              <div className="space-y-1">
                                {order.items.map((item, index) => (
                                  <div key={index} className="text-white text-sm">{item}</div>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-white font-bold">${order.total}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                order.status === 'completed' 
                                  ? 'bg-green-500/20 text-green-300'
                                  : 'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="p-4">
                              <button className="px-4 py-2 bg-steam-accent/20 hover:bg-steam-accent/30 text-steam-accent hover:text-white rounded-lg text-sm transition-colors">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-steam-mid border border-white/10 rounded-2xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">{orders.length}</div>
                    <div className="text-gray-400">Total Orders</div>
                  </div>
                  <div className="bg-steam-mid border border-white/10 rounded-2xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </div>
                    <div className="text-gray-400">Total Spent</div>
                  </div>
                  <div className="bg-steam-mid border border-white/10 rounded-2xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      {orders.filter(o => o.status === 'completed').length}
                    </div>
                    <div className="text-gray-400">Completed Orders</div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-white/10 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                  <p className="text-gray-400">Manage your account preferences and security</p>
                </div>

                <div className="bg-steam-mid border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-steam-dark/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-full">
                          <FaLock className="text-blue-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">Change Password</div>
                          <div className="text-gray-400 text-sm">Update your account password</div>
                        </div>
                      </div>
                      <button
                        onClick={handleChangePassword}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-white rounded-lg transition-colors"
                      >
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-steam-dark/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-full">
                          <FaEnvelope className="text-green-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">Email Notifications</div>
                          <div className="text-gray-400 text-sm">Receive updates about your account</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-steam-dark/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-full">
                          <FaCreditCard className="text-purple-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">Payment Methods</div>
                          <div className="text-gray-400 text-sm">Manage your saved payment methods</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-white rounded-lg transition-colors">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-steam-mid border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Linked Accounts</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-steam-dark/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <FaSteam className="text-2xl text-white" />
                        <div>
                          <div className="text-white font-medium">Steam Account</div>
                          <div className="text-gray-400 text-sm">Not connected</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        Connect
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-steam-dark/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <FaDiscord className="text-2xl text-indigo-400" />
                        <div>
                          <div className="text-white font-medium">Discord</div>
                          <div className="text-gray-400 text-sm">Connected as gamer123</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white rounded-lg transition-colors">
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Danger Zone</h3>
                  <p className="text-gray-400 mb-6">These actions are irreversible. Please proceed with caution.</p>
                  
                  <div className="space-y-4">
                    <button className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white rounded-lg transition-colors text-left">
                      Delete Account
                    </button>
                    <button className="w-full px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 hover:text-white rounded-lg transition-colors text-left">
                      Deactivate Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;