import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGamepad, FaSteam } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Data user statis (bisa ditambah sesuai kebutuhan)
  const staticUsers = [
    { 
      email: 'admin@gamehub.com', 
      password: 'admin123', 
      name: 'Administrator',
      role: 'admin',
      avatar: '👑'
    },
    { 
      email: 'user@gmail.com', 
      password: 'user123', 
      name: 'John Gamer',
      role: 'user',
      avatar: '🎮'
    },
    { 
      email: 'test@gmail.com', 
      password: 'test123', 
      name: 'Test User',
      role: 'user',
      avatar: '👤'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi loading
    setTimeout(() => {
      // Cari user berdasarkan email dan password
      const user = staticUsers.find(
        user => user.email === formData.email && user.password === formData.password
      );

      if (user) {
        // Simpan data user di localStorage
        localStorage.setItem('user', JSON.stringify({
          id: Date.now(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }));
        
        // Simpan token
        localStorage.setItem('token', `fake_jwt_token_${Date.now()}`);
        
        // Simpan timestamp login
        localStorage.setItem('login_time', Date.now().toString());
        
        toast.success(`Welcome back, ${user.name}!`);
        
        // Redirect berdasarkan role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast.error('Invalid email or password!');
      }
      setLoading(false);
    }, 1000);
  };

  const handleGuestLogin = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Buat user guest
      const guestUser = {
        id: 'guest_' + Date.now(),
        name: 'Guest Player',
        email: 'guest@gamehub.com',
        role: 'guest',
        avatar: '👾'
      };
      
      localStorage.setItem('user', JSON.stringify(guestUser));
      localStorage.setItem('token', `guest_token_${Date.now()}`);
      localStorage.setItem('login_time', Date.now().toString());
      
      toast.success('Welcome as Guest!');
      navigate('/');
      setLoading(false);
    }, 800);
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    toast.info('Credentials filled! Click Login to continue.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-steam-accent to-blue-600 rounded-full mb-4">
              <FaSteam className="text-2xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your GameHub account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FaUser className="text-steam-accent" />
                  <span>Email Address</span>
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full bg-gray-900/50 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-steam-accent focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FaLock className="text-steam-accent" />
                  <span>Password</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full bg-gray-900/50 border border-white/10 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-steam-accent focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-steam-accent rounded focus:ring-steam-accent focus:ring-2 bg-gray-800 border-white/10"
                />
                <span className="text-gray-400 text-sm">Remember me</span>
              </label>
              <button
                type="button"
                className="text-steam-accent hover:text-blue-400 text-sm font-medium"
                onClick={() => toast.info('Feature coming soon!')}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-steam-accent to-blue-600 hover:from-blue-600 hover:to-steam-accent text-white py-3 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick Login Buttons */}
          <div className="mt-6 space-y-3">
            <p className="text-gray-400 text-sm text-center">Quick Login (For Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              {staticUsers.map((user, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickLogin(user.email, user.password)}
                  className="px-3 py-2 bg-gray-900/50 hover:bg-gray-800/50 text-gray-300 hover:text-white rounded-lg text-sm transition-colors flex flex-col items-center gap-1"
                >
                  <span className="text-lg">{user.avatar}</span>
                  <span className="text-xs truncate w-full">{user.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guest Login */}
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full mt-6 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <FaGamepad />
            Continue as Guest
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900/50 text-gray-400">Don't have an account?</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-steam-accent hover:text-blue-400 font-medium"
              onClick={() => toast.info('Register feature coming soon!')}
            >
              Create new account
            </Link>
          </div>

          {/* Security Info */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm">Secure login • Encrypted connection</span>
              </div>
              <p className="text-gray-500 text-xs">
                This is a demo application. For production use proper authentication.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Demo Credentials Card */}
        <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-bold mb-2 text-sm">Demo Credentials</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-400 text-xs">Admin Account:</div>
              <div className="text-white text-xs font-mono">admin@gamehub.com / admin123</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-400 text-xs">User Account:</div>
              <div className="text-white text-xs font-mono">user@gmail.com / user123</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-400 text-xs">Test Account:</div>
              <div className="text-white text-xs font-mono">test@gmail.com / test123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;