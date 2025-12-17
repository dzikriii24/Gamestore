import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GameProvider } from './contexts/GameContext';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AdminPage from './pages/AdminPage';
import TrendingPage from './pages/TrendingPage';
import DealsPage from './pages/DealsPage';
import AdminAuth from './pages/AdminAuth';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';



function App() {
  return (
    <Router>
      <GameProvider>
        <div className="flex min-h-screen bg-steam-dark text-white">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminAuth />} />
              <Route path="/admin" element={<AdminPage />} />

              <Route path="/profile" element={<ProfilePage />} />

              <Route path="/category/:category" element={<GamesPage />} />


            </Routes>
          </main>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1b2838',
              color: '#fff',
              border: '1px solid #2a475e'
            }
          }}
        />
      </GameProvider>
    </Router>
  );
}

export default App;