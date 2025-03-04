import React from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { getDate } from "../../../utils/helper";
import { User } from "../../../types/user";

interface UserRowProps {
  user: User;
  onPromote: (
    id: string,
    name: string,
    action: "promoteAdmin" | "promoteSeller" | "demoteSeller"
  ) => void;
  onDelete: (id: string, name: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onPromote, onDelete }) => {
  return (
    <TableRow
      hover
      sx={{
        "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
        transition: "background-color 0.3s",
      }}
    >
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1">{user.name}</Typography>
          <Tooltip
            title={
              <>
                <div>ID: {user._id}</div>
                <div>Date Created: {getDate(new Date(user.createdAt))}</div>
                {user.updatedAt && (
                  <div>Last Updated: {getDate(new Date(user.updatedAt))}</div>
                )}
              </>
            }
            placement="top"
          >
            <IconButton size="small">
              <InfoIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{user.email}</Typography>
      </TableCell>
      <TableCell>
        {user.isAdmin ? (
          <Chip
            label="Admin"
            size="small"
            sx={{ backgroundColor: "#6a1b9a", color: "white" }}
          />
        ) : user.isSeller ? (
          <Chip
            label="Seller"
            size="small"
            sx={{ backgroundColor: "#ffb300", color: "white" }}
          />
        ) : (
          <Chip
            label="User"
            size="small"
            sx={{ backgroundColor: "#bdbdbd", color: "white" }}
          />
        )}
      </TableCell>
      <TableCell>
        <Box display="flex" gap={1}>
          {!user.isAdmin && !user.isSeller && (
            <>
              <Tooltip title="Promote to Admin">
                <IconButton
                  size="small"
                  onClick={() => onPromote(user._id, user.name, "promoteAdmin")}
                  sx={{
                    backgroundColor: "#81c784",
                    color: "white",
                    "&:hover": { backgroundColor: "#4caf50" },
                  }}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Promote to Seller">
                <IconButton
                  size="small"
                  onClick={() =>
                    onPromote(user._id, user.name, "promoteSeller")
                  }
                  sx={{
                    backgroundColor: "#64b5f6",
                    color: "white",
                    "&:hover": { backgroundColor: "#42a5f5" },
                  }}
                >
                  <StorefrontIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
          {!user.isAdmin && user.isSeller && (
            <Tooltip title="Demote from Seller">
              <IconButton
                size="small"
                onClick={() => onPromote(user._id, user.name, "demoteSeller")}
                sx={{
                  backgroundColor: "#ff8a65",
                  color: "white",
                  "&:hover": { backgroundColor: "#ff7043" },
                }}
              >
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete(user._id, user.name)}
              sx={{
                backgroundColor: "#ef5350",
                color: "white",
                "&:hover": { backgroundColor: "#c62828" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
