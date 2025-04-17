import React, { useEffect } from "react";
import { Card, CardContent, Typography, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  fetchReviews,
  addReview,
  editReview,
  deleteReview,
} from "../../redux/reviews/review-slice";
import ReviewForm, { ReviewFormInputs } from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import { ReviewTypes } from "../../types/review";

interface ReviewsSectionProps {
  productId: string;
  currentUserId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  currentUserId,
}) => {
  const dispatch = useAppDispatch();
  const slice = useAppSelector(
    (s) =>
      s.reviews[productId] || {
        items: [],
        loading: false,
        error: null,
      }
  );

  useEffect(() => {
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  const handleAdd = (data: ReviewFormInputs): void => {
    if (data.rating == null) return;
    dispatch(
      addReview({
        productId,
        rating: data.rating,
        comment: data.comment,
      })
    );
  };

  const handleEdit = (data: {
    reviewId: string;
    rating: number;
    comment: string;
  }): void => {
    dispatch(
      editReview({
        productId,
        reviewId: data.reviewId,
        rating: data.rating,
        comment: data.comment,
      })
    );
  };

  const handleDelete = (reviewId: string): void => {
    dispatch(deleteReview({ productId, reviewId }));
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h6" color="primary">
              Reviews
            </Typography>
          </Grid>

          <Grid size={12}>
            {slice.loading ? (
              <Typography>Loading reviews…</Typography>
            ) : slice.items.length ? (
              slice.items.map((review: ReviewTypes) => (
                <ReviewItem
                  key={review._id}
                  review={review}
                  currentUserId={currentUserId}
                  onEdit={(r) =>
                    handleEdit({
                      reviewId: r._id,
                      rating: r.rating,
                      comment: r.comment,
                    })
                  }
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <Typography>No reviews yet</Typography>
            )}
            {slice.error && (
              <Typography color="error">{slice.error}</Typography>
            )}
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" color="primary" gutterBottom>
              Leave a Review
            </Typography>
            <ReviewForm onSubmit={handleAdd} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;
