import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { services } from '../services';
import { useToast } from '../contexts/ToastContext';
import type { Machine, Location, CreateMachineRequest, UpdateMachineRequest } from '../types/machine';
import '../styles/create-edit-machine.css';

interface LocationState {
  mode: 'create' | 'edit';
  machine?: Machine;
  locationId: number;
  locationName: string;
}

export const CreateEditMachinePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showError, showSuccess } = useToast();
  
  // Get state from navigation
  const state = location.state as LocationState;
  const isEditMode = state?.mode === 'edit';
  const machine = state?.machine;
  const defaultLocationId = state?.locationId;
  const locationName = state?.locationName;
  
  // Form state
  const [formData, setFormData] = useState<CreateMachineRequest>({
    machineNo: machine?.machineNo || 0,
    machineName: machine?.machineName || '',
    machineType: machine?.machineType || '',
    macId: machine?.macId || '',
    locationId: defaultLocationId || 0
  });
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load locations on component mount
  useEffect(() => {
    loadLocations();
  }, []);

  // Load locations
  const loadLocations = async () => {
    setLocationsLoading(true);
    try {
      const response = await services.getMachineService().getActiveLocations();
      if (response.success) {
        setLocations(response.data);
      } else {
        showError(response.message || 'Failed to load locations');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to load locations');
    } finally {
      setLocationsLoading(false);
    }
  };

  // Form field handlers
  const handleFieldChange = (field: keyof CreateMachineRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.machineName.trim()) {
      newErrors.machineName = 'Machine name is required';
    }

    if (formData.machineNo <= 0) {
      newErrors.machineNo = 'Machine number must be greater than 0';
    }

    if (!formData.machineType.trim()) {
      newErrors.machineType = 'Machine type is required';
    }

    if (!formData.macId.trim()) {
      newErrors.macId = 'MAC ID is required';
    }

    if (formData.locationId <= 0) {
      newErrors.locationId = 'Location is required';
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
      let response;
      
      if (isEditMode && machine) {
        // Update existing machine
        const updateData: UpdateMachineRequest = {
          ...formData,
          id: machine.id
        };
        response = await services.getMachineService().updateMachine(updateData);
      } else {
        // Create new machine
        response = await services.getMachineService().createMachine(formData);
      }

      if (response.success) {
        const action = isEditMode ? 'updated' : 'created';
        showSuccess(`Machine ${action} successfully!`);
        navigate('/manage-machines');
      } else {
        const action = isEditMode ? 'update' : 'create';
        showError(response.message || `Failed to ${action} machine`);
      }
    } catch (error: any) {
      const action = isEditMode ? 'update' : 'create';
      showError(error.message || `Failed to ${action} machine`);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/manage-machines');
  };

  // If no state, redirect back
  if (!state) {
    navigate('/manage-machines');
    return null;
  }

  return (
    <div className="create-edit-machine-outer-card">
      {/* Loading bar at the top */}
      {loading && (
        <div className="loading-bar">
          <div className="loading-bar-progress" />
        </div>
      )}

      {/* Header */}
      <div className="create-edit-machine-header">
        <button className="back-arrow-btn" aria-label="Back" onClick={handleCancel}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 24L10 16L18 8" stroke="#353535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="header-title">
          {isEditMode ? 'Edit Machine' : 'Create Machine'}
        </span>
      </div>

      {/* Main Content */}
      <div className="create-edit-machine-page-container">
        <div className="create-edit-machine-form">
          <div className="form-title">
            {isEditMode ? 'Edit Machine' : 'Create Machine'}
          </div>
          
          <form onSubmit={handleSubmit} className="form-section">
            {/* Machine Name Field */}
            <div className="form-group">
              <label className="form-label">Machine Name</label>
              <input
                className={`form-input ${errors.machineName ? 'error' : ''}`}
                type="text"
                placeholder="Enter machine name"
                value={formData.machineName}
                onChange={e => handleFieldChange('machineName', e.target.value)}
              />
              {errors.machineName && (
                <span className="error-message">{errors.machineName}</span>
              )}
            </div>

            {/* Machine Number Field */}
            <div className="form-group">
              <label className="form-label">Machine Number</label>
              <input
                className={`form-input ${errors.machineNo ? 'error' : ''}`}
                type="number"
                placeholder="Enter machine number"
                value={formData.machineNo}
                onChange={e => handleFieldChange('machineNo', Number(e.target.value))}
                min="1"
                max="8"
              />
              {errors.machineNo && (
                <span className="error-message">{errors.machineNo}</span>
              )}
            </div>

            {/* Machine Type Field */}
            <div className="form-group">
              <label className="form-label">Machine Type</label>
              <select
                className={`form-input ${errors.machineType ? 'error' : ''}`}
                value={formData.machineType}
                onChange={e => handleFieldChange('machineType', e.target.value)}
              >
                <option value="">Select Machine Type</option>
                <option value="SKI">SKI</option>
                <option value="ROW">ROW</option>
                <option value="BIKE">BIKE</option>
              </select>
              {errors.machineType && (
                <span className="error-message">{errors.machineType}</span>
              )}
            </div>

            {/* MAC ID Field */}
            <div className="form-group">
              <label className="form-label">MAC ID</label>
              <input
                className={`form-input ${errors.macId ? 'error' : ''}`}
                type="text"
                placeholder="Enter MAC ID"
                value={formData.macId}
                onChange={e => handleFieldChange('macId', e.target.value)}
              />
              {errors.macId && (
                <span className="error-message">{errors.macId}</span>
              )}
            </div>

            {/* Location Field */}
            <div className="form-group">
              <label className="form-label">Location</label>
              <select
                className={`form-input ${errors.locationId ? 'error' : ''}`}
                value={formData.locationId}
                onChange={e => handleFieldChange('locationId', Number(e.target.value))}
                disabled={locationsLoading}
              >
                <option value={0}>Select Location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              {errors.locationId && (
                <span className="error-message">{errors.locationId}</span>
              )}
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
                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Machine' : 'Create Machine')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 