import { useState, useEffect } from "react";

interface ReviewFormProps {
    initialRating: number;
    initialReview: string;
    onSubmit: (rating: number, review: string) => void;
    isSubmitting: boolean;
}

export function ReviewForm({ initialRating, initialReview, onSubmit, isSubmitting }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    useEffect(() => {
        if (initialRating) setRating(initialRating);
        if (initialReview) setReviewText(initialReview);
    }, [initialRating, initialReview]);

    const handleStarClick = (starIndex: number) => {
        setRating(starIndex + 1);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Review Text Input */}
            <div>
                <h3 className="mb-3 text-sm font-bold text-black">Berikan Ulasan</h3>
                <textarea
                    className="w-full h-28 resize-none rounded-lg border border-gray-300 p-3 text-black text-sm focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                    placeholder="Masukkan ulasan"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
            </div>

            <div className="flex justify-center pt-2">
                <button
                    type="button"
                    onClick={() => onSubmit(rating, reviewText)}
                    disabled={isSubmitting}
                    className="rounded-full bg-[#1E8F59] px-12 py-2.5 font-semibold text-white text-sm shadow-md transition-all hover:bg-[#166E45] disabled:opacity-50"
                >
                    {isSubmitting ? "Mengirim..." : "Kirim"}
                </button>
            </div>
        </div>
    );
}
