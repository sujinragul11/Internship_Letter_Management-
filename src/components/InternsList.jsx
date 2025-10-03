import React, { useState, useMemo } from 'react';
import { Eye, Trash2, CreditCard as Edit, Mail, FileText } from 'lucide-react';
import { supabaseStorage } from '../utils/supabaseStorage';
import SearchAndFilter from './SearchAndFilter';

function InternsList({ interns, onRefresh, onViewLetter }) {
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const handleDelete = async (internId) => {
    if (window.confirm('Are you sure you want to delete this intern record?')) {
      try {
        await supabaseStorage.deleteIntern(internId);
        onRefresh();
      } catch (error) {
        console.error('Error deleting intern:', error);
        alert('Failed to delete intern');
      }
    }
  };

  const filteredInterns = useMemo(() => {
    let filtered = [...interns];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (intern) =>
          intern.name.toLowerCase().includes(term) ||
          intern.email.toLowerCase().includes(term) ||
          intern.position.toLowerCase().includes(term)
      );
    }

    if (activeFilters.positions?.length > 0) {
      filtered = filtered.filter((intern) =>
        activeFilters.positions.includes(intern.position)
      );
    }

    if (activeFilters.durations?.length > 0) {
      filtered = filtered.filter((intern) =>
        activeFilters.durations.includes(intern.duration)
      );
    }

    if (activeFilters.statuses?.length > 0) {
      filtered = filtered.filter((intern) =>
        activeFilters.statuses.includes(intern.status || 'active')
      );
    }

    return filtered;
  }, [interns, searchTerm, activeFilters]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Interns</h2>
          <p className="text-gray-600 mt-1">
            View, edit, and manage intern records and letters
          </p>
        </div>
      </div>

      {interns.length > 0 && (
        <SearchAndFilter
          onSearch={setSearchTerm}
          onFilter={setActiveFilters}
          searchTerm={searchTerm}
          activeFilters={activeFilters}
        />
      )}

      {interns.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interns Found</h3>
          <p className="text-gray-600">Start by adding your first intern to begin generating letters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intern Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position & Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInterns.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No interns match your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInterns.map((intern) => (
                  <tr key={intern.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {intern.name}
                        </div>
                        <div className="text-sm text-gray-500">{intern.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{intern.position}</div>
                        <div className="text-sm text-gray-500">{intern.duration}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(intern.start_date || intern.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        (intern.status || 'active') === 'active'
                          ? 'bg-green-100 text-green-800'
                          : (intern.status || 'active') === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {(intern.status || 'active').charAt(0).toUpperCase() + (intern.status || 'active').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onViewLetter(intern, 'offer')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors"
                          title="View Offer Letter"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Offer</span>
                        </button>
                        <button
                          onClick={() => onViewLetter(intern, 'completion')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors"
                          title="View Completion Letter"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Complete</span>
                        </button>
                        <button
                          onClick={() => handleDelete(intern.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors"
                          title="Delete Intern"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default InternsList;