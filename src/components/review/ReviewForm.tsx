import React from "react";
import { Box, Rating, TextField, Button, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

export type ReviewFormInputs = {
  rating: number | null;
  comment: string;
};

interface ReviewFormProps {
  initialRating?: number | null;
  initialComment?: string;
  maxChars?: number;
  onSubmit: (data: ReviewFormInputs) => void;
  submitLabel?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  initialRating = null,
  initialComment = "",
  maxChars = 500,
  onSubmit,
  submitLabel = "Submit",
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid },
  } = useForm<ReviewFormInputs>({
    mode: "onChange",
    defaultValues: { rating: initialRating, comment: initialComment },
  });

  const commentValue = watch("comment") || "";
  const charsRemaining = maxChars - commentValue.length;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 2 }}
    >
      <Controller
        name="rating"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Rating
            {...field}
            precision={0.5}
            aria-label="Review rating"
            sx={{ mb: 1 }}
          />
        )}
      />

      <Controller
        name="comment"
        control={control}
        rules={{
          required: "Comment is required",
          maxLength: { value: maxChars, message: "Too many characters" },
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            required
            multiline
            rows={3}
            margin="normal"
            label="Comment"
            inputProps={{ maxLength: maxChars }}
            error={!!fieldState.error}
            helperText={
              fieldState.error
                ? fieldState.error.message
                : `${charsRemaining} character${
                    charsRemaining === 1 ? "" : "s"
                  } remaining`
            }
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!isValid || isSubmitting}
        sx={{ mt: 2 }}
      >
        {submitLabel}
      </Button>
    </Box>
  );
};

export default React.memo(ReviewForm);
