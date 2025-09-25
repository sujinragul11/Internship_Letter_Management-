export const validationRules = {
  name: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must contain only letters and spaces'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  position: {
    required: true,
    minLength: 3,
    message: 'Position must be at least 3 characters long'
  },
  startDate: {
    required: true,
    message: 'Start date is required'
  },
  duration: {
    required: true,
    minLength: 1,
    message: 'Duration is required'
  },
  location: {
    required: true,
    minLength: 10,
    message: 'Please provide a complete address'
  },
  stipend: {
    required: true,
    minLength: 3,
    message: 'Stipend information is required'
  },
  date: {
    required: true,
    message: 'Letter date is required'
  }
};

export const validateField = (field, value) => {
  const rules = validationRules[field];
  if (!rules) return null;

  if (rules.required && !value.trim()) {
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message;
  }

  return null;
};

export const validateForm = (formData) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const error = validateField(field, formData[field] || '');
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};