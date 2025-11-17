import React, { useState, useCallback } from 'react';

const SearchBar = React.memo(({ onSearch, loading }) => {
  const [city, setCity] = useState("");

  const handleSearch = useCallback(() => {
    onSearch(city);
  }, [city, onSearch]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="flex justify-center gap-3 mb-6">
      <input
        className="px-4 py-3 w-64 text-black rounded-lg shadow-md"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />
      <button 
        className="glow-button px-5 py-3" 
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Search'}
      </button>
    </div>
  );
});

export default SearchBar;