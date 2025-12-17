import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import { useGameContext } from '../contexts/GameContext';
import { FaFilter, FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const GamesPage = () => {
  const { games, categories, loading, applyFilters, filters } = useGameContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Synchronize local filters with context filters
  const [localFilters, setLocalFilters] = useState({
    category: filters.category || '',
    minPrice: filters.minPrice || '',
    maxPrice: filters.maxPrice || '',
    onSale: filters.onSale || false,
    sort: filters.sort || 'latest',
    search: filters.search || ''
  });

  // Sync local filters when context filters change
  useEffect(() => {
    setLocalFilters({
      category: filters.category || '',
      minPrice: filters.minPrice || '',
      maxPrice: filters.maxPrice || '',
      onSale: filters.onSale || false,
      sort: filters.sort || 'latest',
      search: filters.search || ''
    });
    
    // Also sync search term if search filter exists
    if (filters.search) {
      setSearchTerm(filters.search);
    }
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Apply filters immediately on change
    applyFilters(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilters = { ...localFilters, search: searchTerm };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      onSale: false,
      sort: 'latest',
      search: ''
    };
    setLocalFilters(resetFilters);
    setSearchTerm('');
    applyFilters(resetFilters);
  };

  // Update search term without triggering search
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-steam-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-xl p-6">
        <h1 className="text-4xl font-bold text-white mb-2">Browse Games</h1>
        <p className="text-gray-300">Discover amazing games from various genres</p>
      </div>

      {/* Search and Filters */}
      <div className="glass-panel rounded-xl p-6 border border-white/5">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                className="w-full bg-steam-mid/70 text-white px-6 py-3 pl-12 rounded-lg border border-white/5 focus:outline-none focus:ring-2 focus:ring-steam-accent"
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-steam-accent hover:bg-steam-accent/80 text-white px-6 py-3 rounded-lg transition-all"
          >
            <FaFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white px-6 py-3 rounded-lg transition-all"
          >
            Clear All
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-steam-mid/60 border border-white/5 rounded-lg">
            {/* Category Filter */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Category</label>
              <select
                value={localFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Min Price</label>
              <input
                type="number"
                placeholder="$0"
                min="0"
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Max Price</label>
              <input
                type="number"
                placeholder="$100"
                min="0"
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg"
              />
            </div>

            {/* Sort and Sale */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Sort By</label>
                <select
                  value={localFilters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg"
                >
                  <option value="latest">Latest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="onSale"
                  checked={localFilters.onSale}
                  onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                  className="w-4 h-4 text-steam-accent rounded focus:ring-steam-accent focus:ring-2"
                />
                <label htmlFor="onSale" className="text-gray-300">
                  On Sale Only
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Games Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {games.length} {games.length === 1 ? 'Game' : 'Games'} Found
          </h2>
          <div className="flex items-center gap-2 text-gray-400">
            {filters.category && (
              <span className="bg-steam-blue px-3 py-1 rounded-full">
                Category: {filters.category}
              </span>
            )}
            {filters.onSale && (
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                On Sale
              </span>
            )}
          </div>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-16 bg-steam-darker rounded-xl">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Games Found</h3>
            <p className="text-gray-400">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;