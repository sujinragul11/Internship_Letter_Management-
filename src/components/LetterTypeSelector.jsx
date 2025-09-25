import React from 'react';
import { FileText, Award } from 'lucide-react';

function LetterTypeSelector({ selectedType, onTypeChange }) {
  const letterTypes = [
    {
      id: 'offer',
      name: 'Offer Letter',
      description: 'Generate an internship offer letter',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'completion',
      name: 'Completion Certificate',
      description: 'Generate an internship completion certificate',
      icon: Award,
      color: 'green'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {letterTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;
        
        return (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              isSelected
                ? `border-${type.color}-500 bg-${type.color}-50`
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Icon className={`h-6 w-6 ${isSelected ? `text-${type.color}-600` : 'text-gray-400'}`} />
              <h3 className={`font-semibold ${isSelected ? `text-${type.color}-900` : 'text-gray-900'}`}>
                {type.name}
              </h3>
            </div>
            <p className={`text-sm ${isSelected ? `text-${type.color}-700` : 'text-gray-600'}`}>
              {type.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default LetterTypeSelector;