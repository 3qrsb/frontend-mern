import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from "@mui/material";

export interface Column {
  label: string;
  key: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps {
  columns: Column[];
  children: React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({ columns, children }) => {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} sx={{ my: 4, boxShadow: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="data table">
        <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                align={col.align || "left"}
                sx={{
                  color: "white",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  py: 1,
                  px: 2,
                  top: 0,
                  zIndex: 1,
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
