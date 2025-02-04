import { useState, useEffect } from "react";

export const useAverageRating = (reviews: { rating: number }[]) => {
  const [average, setAverage] = useState<number>(0);

  useEffect(() => {
    if (reviews.length > 0) {
      const total = reviews.reduce((acc, review) => acc + review.rating, 0);
      setAverage(total / reviews.length);
    } else {
      setAverage(0);
    }
  }, [reviews]);

  return average;
};
