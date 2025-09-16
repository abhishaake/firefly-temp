import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { services } from '../services';
import { useToast } from '../contexts/ToastContext';
import type { CreateUserRequest } from '../types/user';
import '../styles/create-user.css';

export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<CreateUserRequest>({
    fullName: '',
    email: '',
    password: '',
    type: 'ADMIN'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Form field handlers
  const handleFieldChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Remove password if it's empty (optional field)
      const payload = {
        ...formData,
        password: formData.password || undefined
      };

      const response = await services.getUserService().createUser(payload);

      if (response.success) {
        showSuccess('User created successfully!');
        navigate('/manage-trainer'); // Navigate to trainer management page
      } else {
        showError(response.message || 'Failed to create user');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/manage-trainer');
  };

  return (
    <div className="create-user-outer-card">
      {/* Loading bar at the top */}
      {loading && (
        <div className="loading-bar">
          <div className="loading-bar-progress" />
        </div>
      )}

      {/* Header */}
      <div className="create-user-header">
        <button className="back-arrow-btn" aria-label="Back" onClick={handleCancel}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 24L10 16L18 8" stroke="#353535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="header-title">Create User</span>
      </div>

      {/* Main Content */}
      <div className="create-user-page-container">
        <div className="create-user-form">
          
          <form onSubmit={handleSubmit} className="form-section">
            {/* Full Name Field */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className={`form-input ${errors.fullName ? 'error' : ''}`}
                type="text"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={e => handleFieldChange('fullName', e.target.value)}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={e => handleFieldChange('email', e.target.value)}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password (Optional)</label>
              <input
                className={`form-input ${errors.password ? 'error' : ''}`}
                type="password"
                placeholder="Enter password (optional)"
                value={formData.password}
                onChange={e => handleFieldChange('password', e.target.value)}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
              <small className="help-text">
                Leave blank to generate a random password, password will be sent to the user's email.
              </small>
            </div>

            {/* User Type Field */}
            <div className="form-group">
              <label className="form-label">User Type</label>
              <select
                className="form-input"
                value={formData.type}
                onChange={e => handleFieldChange('type', e.target.value as 'ADMIN' | 'TRAINER')}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="TRAINER">TRAINER</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 