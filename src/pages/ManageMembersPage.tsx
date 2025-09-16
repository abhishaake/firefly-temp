import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MemberTable } from '../components/member/MemberTable';
import { services } from '../services';
import type { Member } from '../types/member';
import '../styles/manage-members.css';

export const ManageMembersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [apiSearchTerm, setApiSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const {
    data: membersResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['members', currentPage, pageSize, apiSearchTerm],
    queryFn: () => services.getMemberService().getAllMembers(currentPage, pageSize, apiSearchTerm),
  });

  const members = membersResponse?.data?.users || [];
  const totalPages = membersResponse?.data?.totalPage || 0;
  const totalItems = totalPages * pageSize; // Approximate total items

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members;

    return filtered;
  }, [members, sortOrder]);

  const handleViewProfile = (memberId: string) => {
    navigate(`/member-profile/${memberId}`);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update API search term and reset to first page
    setApiSearchTerm(searchTerm);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="manage-members-page">
      <div className="manage-members-header">
        <h1 className="manage-members-header-title">Manage Members</h1>
        <div className="manage-members-search-section">
          <form onSubmit={handleSearch} className="manage-members-search-container">
            <input
              type="text"
              placeholder="Search member"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="manage-members-search-input"
            />
            <button type="submit" className="manage-members-search-icon"
              onClick={handleSearch}
            >
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
          {/* <button onClick={handleSort} className="manage-members-sort-button">
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
        </div>
      </div>

      <MemberTable
        members={filteredAndSortedMembers}
        onViewProfile={handleViewProfile}
        isLoading={isLoading}
        error={error?.message || null}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}; 