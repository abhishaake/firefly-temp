import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrainerTable } from '../components/trainer/TrainerTable';
import { services } from '../services';
import type { Trainer } from '../types/trainer';
import '../styles/manage-trainer.css';
import { useNavigate } from 'react-router-dom';

export const ManageTrainerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [apiSearchTerm, setApiSearchTerm] = useState('');

  const {
    data: trainersResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['trainers', apiSearchTerm],
    queryFn: () => services.getTrainerService().getAllTrainers(apiSearchTerm),
  });

  const trainers = trainersResponse?.data || [];

  const filteredAndSortedTrainers = useMemo(() => {
    let filtered = trainers;


    return filtered;
  }, [trainers, searchTerm, sortOrder]);


  const handleCreateUser = () => {
    navigate('/create-user');
  };

  const handleViewProfile = (trainerId: string) => {
    console.log('View profile for trainer:', trainerId);
    // TODO: Navigate to trainer profile page
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useMemo hook
    setApiSearchTerm(searchTerm);
  };

  return (
    <div className="manage-trainer-page">
      <div className="manage-trainer-header">
        <h1 className="manage-trainer-header-title">Manage Trainers</h1>
        <div className="manage-trainer-search-section">
          <form onSubmit={handleSearch} className="manage-trainer-search-container">
            <input
              type="text"
              placeholder="Search member"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="manage-trainer-search-input"
            />
            <button type="submit" className="manage-trainer-search-icon" onClick={handleSearch}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.9999 19L14.6499 14.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
          {/* <button onClick={handleSort} className="manage-trainer-sort-button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6L8 11L13 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sort
          </button> */}
          <div className="manage-trainers-table-container">
            <button className="manage-trainers-create-user-btn" onClick={handleCreateUser}>
              Create User
            </button>
          </div>
        </div>
        
      </div>

      <TrainerTable
        trainers={filteredAndSortedTrainers}
        onViewProfile={handleViewProfile}
        isLoading={isLoading}
        error={error?.message || null}
      />
    </div>
  );
}; 