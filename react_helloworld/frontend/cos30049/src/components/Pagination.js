// src/components/Pagination.js
import React from 'react';
import './Pagination.css';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Function to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxPageNumbers = 7; // Maximum page numbers to display (including ellipsis)
    const siblingCount = 1; // Number of pages to show on each side of current page

    const totalNumbers = siblingCount * 2 + 5; // siblings*2 + current + first & last + two ellipsis
    const totalBlocks = totalNumbers;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - siblingCount);
      const endPage = Math.min(totalPages - 1, currentPage + siblingCount);
      const hasLeftEllipsis = startPage > 2;
      const hasRightEllipsis = endPage < totalPages - 1;

      const firstPages = [1];
      const lastPages = [totalPages];

      const middlePages = [];
      for (let i = startPage; i <= endPage; i++) {
        middlePages.push(i);
      }

      if (hasLeftEllipsis && !hasRightEllipsis) {
        // Left ellipsis, no right ellipsis
        return [...firstPages, '...', ...middlePages, ...lastPages];
      }

      if (!hasLeftEllipsis && hasRightEllipsis) {
        // Right ellipsis, no left ellipsis
        return [...firstPages, ...middlePages, '...', ...lastPages];
      }

      if (hasLeftEllipsis && hasRightEllipsis) {
        // Both ellipsis
        return [...firstPages, '...', ...middlePages, '...', ...lastPages];
      }
    }

    // If total pages less than max, show all pages
    const allPages = [];
    for (let i = 1; i <= totalPages; i++) {
      allPages.push(i);
    }
    return allPages;
  };

  const pageNumbers = getPageNumbers();

  // Handle Previous Button Click
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Handle Next Button Click
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-controls">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        &#8592; Previous
      </button>

      {pageNumbers.map((number, index) => {
        if (number === '...') {
          return (
            <span key={`ellipsis-${index}`} className="ellipsis">
              ...
            </span>
          );
        }

        return (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`pagination-button ${
              currentPage === number ? 'active' : ''
            }`}
          >
            {number}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next &#8594;
      </button>
    </div>
  );
};

export default Pagination;
