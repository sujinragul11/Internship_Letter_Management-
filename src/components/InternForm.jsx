import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { storageUtils } from '../utils/storage';

function InternForm({ onSave, intern = null }) {
  const [formData, setFormData] = useState({
    name: intern?.name || '',
    email: intern?.email || '',
    position: intern?.position || '',
    startDate: intern?.startDate || '',
    duration: intern?.duration || '',
    location:
      intern?.location ||
      'Roriri Software Solution Pvt. Ltd, Nallanathapuram, Kalakad',
    stipend: intern?.stipend || '',
    date: intern?.date || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.stipend.trim())
      newErrors.stipend = 'Stipend information is required';
    if (!formData.date) newErrors.date = 'Date is required';

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const internData = {
        id: intern?.id || Date.now().toString(),
        ...formData,
        createdAt: intern?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      storageUtils.saveIntern(internData);

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSave();
    } catch (error) {
      console.error('Error saving intern:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {intern ? 'Edit Intern Details' : 'Add New Intern'}
          </h2>
          <p className="text-gray-600 mt-1">
            Enter the intern&apos;s information to generate letters
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter intern's full name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="intern@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Position */}
            <div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Position *
  </label>
  <select
    value={formData.position}
    onChange={(e) => handleChange('position', e.target.value)}
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      errors.position ? 'border-red-500' : 'border-gray-300'
    }`}
  >
    <option value="">-- Select Position --</option>
    <option value="Digital Marketing">Digital Marketing</option>
    <option value="Human Resource">Human Resource</option>
    <option value="UI/UX Design">UI/UX Design</option>
    <option value="Front End">Front End</option>
    <option value="Flutter">Flutter</option>
    <option value="Backend Developer">Backend Developer</option>
    <option value="Fullstack Developer">Fullstack Developer</option>
    <option value="Software Tester">Software Tester</option>
    <option value="Mobile App Developer">Mobile App Developer</option>
    <option value="Data Analyst">Data Analyst</option>
    <option value="Data Scientist">Data Scientist</option>
    <option value="AI / ML">AI / ML</option>
  </select>
  {errors.position && (
    <p className="text-red-500 text-xs mt-1">{errors.position}</p>
  )}
</div>


            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>

            {/* Duration */}
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Duration *
  </label>
  <select
    value={formData.duration}
    onChange={(e) => handleChange('duration', e.target.value)}
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      errors.duration ? 'border-red-500' : 'border-gray-300'
    }`}
  >
    <option value="">-- Select Duration --</option>
    <option value="1 Month">1 Month</option>
    <option value="3 Months">3 Months</option>
    <option value="6 Months">6 Months</option>
  </select>
  {errors.duration && (
    <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
  )}
</div>


            {/* Letter Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Letter Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Stipend */}
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Stipend Information *
  </label>
  <select
    value={formData.stipend}
    onChange={(e) => handleChange('stipend', e.target.value)}
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      errors.stipend ? 'border-red-500' : 'border-gray-300'
    }`}
  >
    <option value="">-- Select Stipend --</option>
    <option value="Paid">Paid Intern</option>
    <option value="Unpaid">Unpaid Intern</option>
  </select>
  {errors.stipend && (
    <p className="text-red-500 text-xs mt-1">{errors.stipend}</p>
  )}
</div>


          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Intern'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InternForm;
