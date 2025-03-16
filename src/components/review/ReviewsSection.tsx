import React from "react";
import { Card, CardContent, Typography, List, Divider } from "@mui/material";
import Message from "../UI/message";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";

interface ReviewsSectionProps {
  product: any;
  userInfo: any;
  rating: number | null;
  comment: string;
  setRating: (rating: number | null) => void;
  setComment: (comment: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editReview: { id: string; comment: string; rating: number } | null;
  handleEditSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleEditReview: (review: any) => void;
  handleDeleteReview: (reviewId: string) => void;
  anchorEl: HTMLElement | null;
  handleMenuClick: (event: React.MouseEvent<HTMLElement>, review: any) => void;
  handleMenuClose: () => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  product,
  userInfo,
  rating,
  comment,
  setRating,
  setComment,
  onSubmit,
  editReview,
  handleEditSubmit,
  handleEditReview,
  handleDeleteReview,
  anchorEl,
  handleMenuClick,
  handleMenuClose,
}) => {
  const renderReviews = () => {
    if (product.reviews?.length) {
      return product.reviews.map((review: any) => (
        <ReviewItem
          key={review._id}
          review={review}
          currentUserId={userInfo?._id}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
          onMenuClick={handleMenuClick}
          anchorEl={anchorEl}
          onMenuClose={handleMenuClose}
        />
      ));
    }
    return <Typography>No reviews yet</Typography>;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          Reviews
        </Typography>
        <List sx={{ p: 0 }}>{renderReviews()}</List>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" color="primary" gutterBottom>
          {editReview ? "Edit Your Review" : "Leave a Comment"}
        </Typography>
        {userInfo ? (
          editReview ? (
            <ReviewForm
              rating={rating}
              comment={comment}
              onRatingChange={setRating}
              onCommentChange={(e) => setComment(e.target.value)}
              onSubmit={handleEditSubmit}
              submitLabel="Update"
            />
          ) : (
            <ReviewForm
              rating={rating}
              comment={comment}
              onRatingChange={setRating}
              onCommentChange={(e) => setComment(e.target.value)}
              onSubmit={onSubmit}
              submitLabel="Submit"
            />
          )
        ) : (
          <Message>You must login to leave a review</Message>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;
