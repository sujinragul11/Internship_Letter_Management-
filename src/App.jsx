import React, { useState, useEffect } from 'react';
import { FileText, Users, Plus, Home, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import InternForm from './components/InternForm';
import LetterPreview from './components/LetterPreview';
import InternsList from './components/InternsList';
import BackendEmailConfiguration from './components/BackendEmailConfiguration';
import { storageUtils } from './utils/storage';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [selectedLetterType, setSelectedLetterType] = useState('offer');
  const [interns, setInterns] = useState([]);
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    setInterns(storageUtils.getInterns());
    setLetters(storageUtils.getLetters());
  }, []);

  const refreshData = () => {
    setInterns(storageUtils.getInterns());
    setLetters(storageUtils.getLetters());
  };

  const handleInternSaved = () => {
    refreshData();
    setCurrentView('interns');
  };

  const handleLetterGenerated = () => {
    refreshData();
  };

  const handleViewLetter = (intern, letterType) => {
    setSelectedIntern(intern);
    setSelectedLetterType(letterType);
    setCurrentView('preview');
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'new-intern', name: 'Add Intern', icon: Plus },
    { id: 'interns', name: 'Manage Interns', icon: Users },
    { id: 'email-config', name: 'Email Service', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Internship Letter Management
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              HR Management System
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        currentView === item.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {currentView === 'dashboard' && (
            <Dashboard 
              interns={interns} 
              letters={letters}
              onViewLetter={handleViewLetter}
              onNavigate={setCurrentView}
            />
          )}
          
          {currentView === 'new-intern' && (
            <InternForm 
              onSave={handleInternSaved}
              intern={null}
            />
          )}
          
          {currentView === 'interns' && (
            <InternsList 
              interns={interns}
              onRefresh={refreshData}
              onViewLetter={handleViewLetter}
            />
          )}
          
          {currentView === 'email-config' && (
            <BackendEmailConfiguration />
          )}
          
          {currentView === 'preview' && selectedIntern && (
            <LetterPreview 
              intern={selectedIntern}
              letterType={selectedLetterType}
              onBack={() => setCurrentView('dashboard')}
              onLetterGenerated={handleLetterGenerated}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;