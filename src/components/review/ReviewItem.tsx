import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Rating,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deepOrange } from "@mui/material/colors";
import { formatDistanceToNow } from "date-fns";
import { ReviewTypes } from "../../types/review";

interface ReviewItemProps {
  review: ReviewTypes;
  currentUserId: string;
  onEdit: (review: ReviewTypes) => void;
  onDelete: (reviewId: string) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: deepOrange[500], mr: 2 }}>
            {review.name.charAt(0)}
          </Avatar>
          <Typography variant="subtitle1" fontWeight="bold">
            {review.name}
          </Typography>
        </Box>

        {currentUserId === review.user && (
          <IconButton
            size="small"
            aria-label="more actions"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        <Rating
          value={review.rating}
          readOnly
          precision={0.5}
          aria-label={`Rating: ${review.rating}`}
          sx={{ mr: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          {formatDistanceToNow(new Date(review.createdAt), {
            addSuffix: true,
          })}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{
          mt: 1,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {review.comment}
      </Typography>

      {currentUserId === review.user && (
        <>
          <Divider sx={{ my: 2 }} />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                onEdit(review);
              }}
            >
              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                onDelete(review._id);
              }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default React.memo(ReviewItem);
