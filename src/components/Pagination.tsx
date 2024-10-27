import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisibleButtons = 5;

  const getPageNumbers = () => {
    if (totalPages <= maxVisibleButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3;
      return [...Array.from({ length: leftItemCount }, (_, i) => i + 1), '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3;
      return [1, '...', ...Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1)];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  };

  return (
    <nav className="flex justify-center items-center space-x-2 mt-4 overflow-x-auto px-4 py-2">
      <button
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded bg-white text-blue-500 hover:bg-blue-100 disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>
      {getPageNumbers()?.map((number, index) => (
        <button
          key={index}
          onClick={() => typeof number === 'number' ? paginate(number) : null}
          className={`px-3 py-1 rounded ${
            currentPage === number
              ? 'bg-blue-500 text-white'
              : 'bg-white text-blue-500 hover:bg-blue-100'
          } ${typeof number !== 'number' ? 'cursor-default' : ''}`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded bg-white text-blue-500 hover:bg-blue-100 disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

export default Pagination;