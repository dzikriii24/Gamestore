import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaKey, FaArrowLeft } from 'react-icons/fa';

const AdminAuth = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const ADMIN_CODE = '123123'; // Kode akses admin

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (code === ADMIN_CODE) {
      // Simpan status autentikasi di localStorage
      localStorage.setItem('admin_authenticated', 'true');
      setError('');
      navigate('/admin'); // Redirect ke halaman admin
    } else {
      setError('Kode akses salah. Silakan coba lagi.');
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full mb-4">
              <FaLock className="text-2xl text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400">Masukkan kode akses untuk masuk ke halaman admin</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                <div className="flex items-center gap-2">
                  <FaKey className="text-steam-accent" />
                  <span>Kode Akses</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError('');
                  }}
                  placeholder="Masukkan 6-digit kode"
                  className="w-full bg-gray-900/50 border border-white/10 text-white px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  maxLength="6"
                  required
                  autoFocus
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <FaLock className="text-gray-500" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-lg">
              <p className="text-sm">
                <strong className="font-semibold">Info:</strong> Kode akses admin adalah <span className="font-mono bg-gray-800/50 px-2 py-1 rounded">123123</span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGoBack}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <FaArrowLeft />
                Kembali
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-red-500/20"
              >
                <FaLock />
                Masuk Admin
              </button>
            </div>
          </form>

          {/* Security Warning */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-center text-xs text-gray-500">
              ⚠️ Halaman ini hanya untuk administrator yang berwenang.
              <br />
              Jangan bagikan kode akses kepada siapapun.
            </p>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AdminAuth;