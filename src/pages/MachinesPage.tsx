import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { services } from '../services';
import { useToast } from '../contexts/ToastContext';
import type { Machine, Location, UpdateMachineRequest } from '../types/machine';
import '../styles/machines.css';
import type { Update } from 'vite/types/hmrPayload.js';

export const MachinesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  // State
  const [locations, setLocations] = useState<Location[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    machine: Machine | null;
  }>({ show: false, machine: null });

  // Load locations on component mount
  useEffect(() => {
    loadLocations();
  }, []);

  // Load machines when location changes
  useEffect(() => {
    if (selectedLocationId) {
      loadMachines(selectedLocationId);
    } else {
      setMachines([]);
    }
  }, [selectedLocationId]);

  // Load active locations
  const loadLocations = async () => {
    setLocationsLoading(true);
    try {
      const response = await services.getMachineService().getActiveLocations();
      if (response.success) {
        setLocations(response.data);
        // Auto-select first location if available
        if (response.data.length > 0 && !selectedLocationId) {
          setSelectedLocationId(response.data[0].id);
        }
      } else {
        showError(response.message || 'Failed to load locations');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to load locations');
    } finally {
      setLocationsLoading(false);
    }
  };

  // Load machines for selected location
  const loadMachines = async (locationId: number) => {
    setLoading(true);
    try {
      const response = await services.getMachineService().getAllMachinesByLocation(locationId);
      if (response.success) {
        setMachines(response.data);
      } else {
        showError(response.message || 'Failed to load machines');
        setMachines([]);
      }
    } catch (error: any) {
      showError(error.message || 'Failed to load machines');
      setMachines([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle location change
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = Number(event.target.value);
    setSelectedLocationId(locationId);
  };

  // Handle create machine
  const handleCreateMachine = () => {
    if (selectedLocationId) {
      navigate('/manage-machines/create', {
        state: {
          mode: 'create',
          locationId: selectedLocationId,
          locationName: locations.find(loc => loc.id === selectedLocationId)?.name
        }
      });
    } else {
      showError('Please select a location first');
    }
  };

  // Handle edit machine
  const handleEditMachine = (machine: Machine) => {
    if (selectedLocationId) {
      navigate('/manage-machines/edit', {
        state: {
          mode: 'edit',
          machine,
          locationId: selectedLocationId,
          locationName: locations.find(loc => loc.id === selectedLocationId)?.name
        }
      });
    } else {
      showError('Please select a location first');
    }
  };


  const handleDeleteMachine = (machine: Machine) => {
    setDeleteConfirmation({ show: true, machine });
  };

  const confirmDeleteMachine = () => {
    if (deleteConfirmation.machine) {
      services.getMachineService().deleteMachine({'id' : deleteConfirmation.machine.id} as UpdateMachineRequest).then(response => {
        if (response.success) {
          showSuccess('Machine deleted successfully');
          loadMachines(selectedLocationId);
        } else {
          showError(response.message || 'Failed to delete machine');
        }
      });
    }
    setDeleteConfirmation({ show: false, machine: null });
  };

  const cancelDeleteMachine = () => {
    setDeleteConfirmation({ show: false, machine: null });
  };

  // Get selected location name
  const getSelectedLocationName = (): string => {
    if (!selectedLocationId) return 'Select Location';
    const location = locations.find(loc => loc.id === selectedLocationId);
    return location ? location.name : 'Select Location';
  };

  return (
    <div>
      {/* Header */}
      <div className="machines-header">
        <div className="header-left">
          <span className="header-title">Machines</span>
        </div>
        <div className="header-right">
          <div className="location-selector">
            <select
              className="location-dropdown"
              value={selectedLocationId || ''}
              onChange={handleLocationChange}
              disabled={locationsLoading}
            >
              <option value="">Select Location</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="create-machine-btn"
            onClick={handleCreateMachine}
            disabled={!selectedLocationId}
          >
            Create
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="machines-page-container">
        {/* Loading state */}
        {locationsLoading && (
          <div className="loading-message">Loading locations...</div>
        )}

        {/* Machines Table */}
        {selectedLocationId && (
          <div className="machines-table-container">
            {loading ? (
              <div className="loading-message">Loading machines...</div>
            ) : (
              <>
                {machines.length > 0 ? (
                  <div className="machines-table">
                    <div className="table-header-row">
                      <div className="table-header-col">Machine Name</div>
                      <div className="table-header-col">Machine No</div>
                      <div className="table-header-col">Machine Type</div>
                      <div className="table-header-col">MAC ID</div>
                      <div className="table-header-col">Action</div>
                    </div>
                    <div className="table-body">
                      {machines.map((machine) => (
                        <div key={machine.id} className="table-row">
                          <div className="table-col">{machine.machineName}</div>
                          <div className="table-col">{machine.machineNo}</div>
                          <div className="table-col">{machine.machineType}</div>
                          <div className="table-col">{machine.macId}</div>
                          <div className="table-col">
                            <button
                              className="edit-btn"
                              onClick={() => handleEditMachine(machine)}
                              title="Edit Machine"
                            >
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.7167 7.51667L12.4833 8.28333L4.93333 15.8333H4.16667V15.0667L11.7167 7.51667ZM15.8333 2.5C15.6113 2.5 15.3893 2.58917 15.2275 2.75167L13.3667 4.6125L16.3875 7.63333L18.2483 5.7725C18.5725 5.44833 18.5725 4.94833 18.2483 4.62417L16.3758 2.75167C16.2142 2.58917 16.0008 2.5 15.8333 2.5ZM11.7167 5.15833L2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833Z" fill="#584769" />
                              </svg>
                            </button>
                            <button
                              className="edit-btn"
                              onClick={() => handleDeleteMachine(machine)}
                              title="Delete Machine"
                            >
                              <svg fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>trash-can</title> <path d="M30 6.749h-5.331l-3.628-5.442c-0.228-0.337-0.609-0.556-1.041-0.557h-8c-0 0-0 0-0 0-0.432 0-0.813 0.219-1.037 0.552l-0.003 0.004-3.628 5.442h-5.332c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h2.858l1.897 20.864c0.060 0.64 0.594 1.137 1.245 1.137 0 0 0 0 0.001 0h16c0 0 0 0 0 0 0.65 0 1.184-0.497 1.243-1.132l0-0.005 1.897-20.864h2.859c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM12.669 3.25h6.661l2.333 3.499h-11.327zM22.859 28.75h-13.718l-1.772-19.5 17.262-0.001zM11 10.75c-0.69 0-1.25 0.56-1.25 1.25v0 14c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-14c0-0.69-0.56-1.25-1.25-1.25v0zM16 10.75c-0.69 0-1.25 0.56-1.25 1.25v0 14c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-14c0-0.69-0.56-1.25-1.25-1.25v0zM21 10.75c-0.69 0-1.25 0.56-1.25 1.25v14c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-14c-0-0.69-0.56-1.25-1.25-1.25h-0z"></path>
                               </g></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="no-machines-message">
                    No machines found for the selected location.
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* No location selected message */}
        {!selectedLocationId && !locationsLoading && (
          <div className="no-location-message">
            Please select a location to view machines.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete the machine "{deleteConfirmation.machine?.machineName}"?
              </p>
              <p className="warning-text">
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={cancelDeleteMachine}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmDeleteMachine}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 