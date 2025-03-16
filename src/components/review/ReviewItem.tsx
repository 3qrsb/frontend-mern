import React from "react";
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
import { getDate } from "../../utils/helper";

interface ReviewItemProps {
  review: any;
  currentUserId: string;
  onEdit: (review: any) => void;
  onDelete: (reviewId: string) => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>, review: any) => void;
  anchorEl: HTMLElement | null;
  onMenuClose: () => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  currentUserId,
  onEdit,
  onDelete,
  onMenuClick,
  anchorEl,
  onMenuClose,
}) => {
  return (
    <Box sx={{ p: 2, mb: 2, boxShadow: 1, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
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
          <IconButton onClick={(event) => onMenuClick(event, review)}>
            <MoreVertIcon />
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
        <Rating value={review.rating} readOnly precision={0.5} sx={{ mr: 2 }} />
        <Typography variant="body2" color="text.secondary">
          {getDate(new Date(review.createdAt))}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {review.comment}
      </Typography>
      <Divider sx={{ mt: 2 }} />
      {currentUserId === review.user && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => onEdit(review)}>
            <EditIcon sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={() => onDelete(review._id)}>
            <DeleteIcon sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>
      )}
    </Box>
  );
};

export default ReviewItem;
