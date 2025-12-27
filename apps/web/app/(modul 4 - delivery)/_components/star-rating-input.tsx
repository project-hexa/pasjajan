import { useState, useEffect } from "react";

interface StarRatingInputProps {
    rating: number;
    onChange: (rating: number) => void;
}

export function StarRatingInput({ rating, onChange }: StarRatingInputProps) {
    return (
        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm h-full flex flex-col justify-center">
            <h3 className="mb-3 text-xs font-bold text-gray-800">
                Seberapa Puas Anda?
            </h3>
            <div className="flex gap-2">
                {[...Array(5)].map((_, index) => (
                    <button
                        type="button"
                        key={index}
                        onClick={() => onChange(index + 1)}
                        className="focus:outline-none hover:scale-110 transition-transform"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={index < rating ? "#facc15" : "none"}
                            stroke="#facc15"
                            strokeWidth={1.5}
                            className="h-8 w-8 cursor-pointer transition-colors"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                            />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
}
