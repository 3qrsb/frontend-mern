import React from "react";
import { Box, Rating, TextField, Button } from "@mui/material";

interface ReviewFormProps {
  rating: number | null;
  comment: string;
  onRatingChange: (newValue: number | null) => void;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  onSubmit,
  submitLabel = "Submit",
}) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
      <Rating
        name="rating"
        value={rating}
        onChange={(event, newValue) => {
          onRatingChange(newValue);
        }}
      />
      <TextField
        required
        fullWidth
        variant="outlined"
        margin="normal"
        label="Comment"
        multiline
        rows={3}
        value={comment}
        onChange={onCommentChange}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        {submitLabel}
      </Button>
    </Box>
  );
};

export default ReviewForm;
