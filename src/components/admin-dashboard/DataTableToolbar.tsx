import React from "react";
import {
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  alpha,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";

export interface DataTableToolbarProps {
  title: string;
  numSelected: number;
  onBulkDelete?: () => void;
  onBulkUpdate?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onFilter?: () => void;
  children?: React.ReactNode;
}

const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  title,
  numSelected,
  onBulkDelete,
  onBulkUpdate,
  onExport,
  onRefresh,
  onFilter,
  children,
}) => {
  const theme = useTheme();

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        mb: 2,
        mt: 2,
        minHeight: 64,
        borderRadius: 1,
        backgroundColor:
          numSelected > 0
            ? alpha(theme.palette.primary.main, 0.1)
            : "background.paper",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        transition: theme.transitions.create("background-color", {
          duration: theme.transitions.duration.short,
        }),
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        alignItems="center"
        sx={{ flex: "1 1 100%" }}
      >
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        {numSelected > 0 && (
          <Typography color="text.secondary" variant="subtitle2">
            {numSelected} selected
          </Typography>
        )}
      </Stack>

      <Stack direction="row" spacing={1}>
        {onFilter && (
          <Tooltip title="Filter">
            <IconButton onClick={onFilter} sx={{ transition: "all 0.2s" }}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
        {onRefresh && (
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh} sx={{ transition: "all 0.2s" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
        {onExport && (
          <Tooltip title="Export">
            <IconButton onClick={onExport} sx={{ transition: "all 0.2s" }}>
              <CloudUploadIcon />
            </IconButton>
          </Tooltip>
        )}
        {onBulkUpdate && (
          <Tooltip title="Bulk Update">
            <IconButton onClick={onBulkUpdate} sx={{ transition: "all 0.2s" }}>
              <UpdateIcon />
            </IconButton>
          </Tooltip>
        )}
        {onBulkDelete && (
          <Tooltip title="Bulk Delete">
            <IconButton onClick={onBulkDelete} sx={{ transition: "all 0.2s" }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        {children}
      </Stack>
    </Toolbar>
  );
};

export default DataTableToolbar;
