'use client';
import React, { useState } from 'react';

export const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void; }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        key={starValue}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => onRatingChange(starValue)}
                        className="bg-transparent border-none cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className={`fill-current transition-colors ${starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-400'}`}
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    </button>
                );
            })}
        </div>
    );
};
