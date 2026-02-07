import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    totalItems: number;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 gap-3 sm:gap-4 md:gap-6">
            <div className="text-xs sm:text-sm text-gray-700 whitespace-nowrap order-1 sm:order-none">
                Results: <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{totalItems}</span>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 flex-1 justify-center order-3 sm:order-none">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1.5 sm:p-2 rounded transition-colors ${currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    aria-label="Previous page"
                >
                    <FaChevronLeft className="text-xs" />
                </button>

                {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-2 sm:px-3 py-1 text-gray-500 text-xs sm:text-sm">
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm font-medium transition-colors ${currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`p-1.5 sm:p-2 rounded transition-colors ${currentPage === totalPages || totalPages === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    aria-label="Next page"
                >
                    <FaChevronRight className="text-xs" />
                </button>
            </div>

            <div className="relative order-2 sm:order-none" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1 sm:space-x-2 bg-gray-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-gray-300 transition-colors text-xs sm:text-sm font-medium"
                >
                    <span>{itemsPerPage}</span>
                    <FaChevronDown className={`text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[80px]">
                        {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onItemsPerPageChange(option);
                                    setDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${itemsPerPage === option ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pagination;
