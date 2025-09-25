import React from 'react';
import { FileText, Users, Calendar, Plus, Eye, Mail } from 'lucide-react';

function Dashboard({ interns, letters, onViewLetter, onNavigate }) {
  const stats = {
    totalInterns: interns.length,
    totalLetters: letters.length,
    offerLetters: letters.filter(l => l.letterType === 'offer').length,
    completionLetters: letters.filter(l => l.letterType === 'completion').length,
  };

  const recentInterns = interns.slice(-5).reverse();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Manage internship letters and track intern records
          </p>
        </div>
        <button
          onClick={() => onNavigate('new-intern')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Intern</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Interns</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInterns}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Letters</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLetters}</p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offer Letters</p>
              <p className="text-2xl font-bold text-gray-900">{stats.offerLetters}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Letters</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completionLetters}</p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Interns */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Interns</h3>
        </div>
        <div className="p-6">
          {recentInterns.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No interns added yet</p>
              <button
                onClick={() => onNavigate('new-intern')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add First Intern
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInterns.map((intern) => (
                <div
                  key={intern.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{intern.name}</h4>
                    <p className="text-sm text-gray-600">{intern.position}</p>
                    <p className="text-xs text-gray-500">
                      Added on {new Date(intern.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewLetter(intern, 'offer')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Offer</span>
                    </button>
                    <button
                      onClick={() => onViewLetter(intern, 'completion')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Completion</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;