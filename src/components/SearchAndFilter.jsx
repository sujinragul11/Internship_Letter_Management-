import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

function SearchAndFilter({ onSearch, onFilter, searchTerm, activeFilters }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(activeFilters || {});

  const positions = ['Digital Marketing', 'Software Development', 'Graphic Design', 'HR', 'Finance', 'Operations'];
  const durations = ['1 Week', '2 Weeks', '1 Month', '2 Months', '3 Months', '6 Months'];

  const handleFilterChange = (type, value) => {
    const newFilters = { ...localFilters };
    if (newFilters[type]?.includes(value)) {
      newFilters[type] = newFilters[type].filter(item => item !== value);
    } else {
      newFilters[type] = [...(newFilters[type] || []), value];
    }
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilter(localFilters);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setLocalFilters({});
    onFilter({});
    setIsFilterOpen(false);
  };

  const activeFilterCount = Object.values(localFilters).flat().length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search interns by name, position, or email..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`px-4 py-2 border rounded-lg flex items-center space-x-2 transition-colors ${
            activeFilterCount > 0
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Position</h4>
              <div className="space-y-2">
                {positions.map(position => (
                  <label key={position} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.positions?.includes(position) || false}
                      onChange={() => handleFilterChange('positions', position)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{position}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Duration</h4>
              <div className="space-y-2">
                {durations.map(duration => (
                  <label key={duration} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.durations?.includes(duration) || false}
                      onChange={() => handleFilterChange('durations', duration)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{duration}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchAndFilter;