import React from "react";
import {
  TableRow,
  TableCell,
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getDate } from "../../../utils/helper";
import { formatCurrency } from "../../../utils/currencyUtils";
import { Product } from "../../../types/product";
import { useCurrencyData } from "../../../hooks/useCurrencyData";

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  userInfo: any;
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  onEdit,
  onDelete,
  userInfo,
}) => {
  const { currency, rates, baseCurrency } = useCurrencyData();

  return (
    <TableRow
      hover
      sx={{
        "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
        transition: "background-color 0.3s",
      }}
    >
      <TableCell>
        <Box
          component="img"
          src={product.images[0]}
          alt={product.name}
          sx={{ width: 50, height: 50, objectFit: "contain", borderRadius: 1 }}
        />
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1">{product.name}</Typography>
          <Tooltip
            title={
              <>
                <div>
                  Stock:{" "}
                  {product.availableQty > 0 ? (
                    <>
                      Yes <CheckCircleIcon fontSize="small" color="success" />
                    </>
                  ) : (
                    <>
                      No <CancelIcon fontSize="small" color="error" />
                    </>
                  )}
                </div>
                <div>Date Added: {getDate(new Date(product.createdAt))}</div>
                <div>Last Updated: {getDate(new Date(product.updatedAt))}</div>
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
        <Typography variant="body2">{product.brand}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{product.category}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {formatCurrency(product.price, currency, rates, baseCurrency)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{product.availableQty}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{product.totalSales}</Typography>
      </TableCell>
      <TableCell>
        {typeof product.user !== "string" ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">{product.user.name}</Typography>
            {product.user.isAdmin && (
              <Chip
                label="Admin"
                size="small"
                sx={{ backgroundColor: "#6a1b9a", color: "white" }}
              />
            )}
            {product.user.isSeller && (
              <Chip
                label="Seller"
                size="small"
                sx={{ backgroundColor: "#ffb300", color: "white" }}
              />
            )}
          </Box>
        ) : (
          <Typography variant="body2">{product.user}</Typography>
        )}
      </TableCell>
      <TableCell>
        <Box display="flex">
          <Tooltip title="Edit Product">
            <IconButton
              onClick={() => onEdit(product)}
              size="small"
              sx={{
                mr: 1,
                backgroundColor:
                  userInfo?._id === product.user || userInfo?.isAdmin
                    ? "#1976d2"
                    : "grey",
                color: "white",
                "&:hover": {
                  backgroundColor:
                    userInfo?._id === product.user || userInfo?.isAdmin
                      ? "#1565c0"
                      : "grey",
                },
              }}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Product">
            <IconButton
              onClick={() => onDelete(product)}
              size="small"
              sx={{
                backgroundColor:
                  userInfo?._id === product.user || userInfo?.isAdmin
                    ? "#ef5350"
                    : "grey",
                color: "white",
                "&:hover": {
                  backgroundColor:
                    userInfo?._id === product.user || userInfo?.isAdmin
                      ? "#c62828"
                      : "grey",
                },
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default ProductRow;
