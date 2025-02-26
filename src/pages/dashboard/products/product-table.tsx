import React, { useEffect, useState } from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { getFilterProducts } from "../../../redux/products/search-list";
import authAxios from "../../../utils/auth-axios";
import { setError } from "../../../utils/error";
import { getDate } from "../../../utils/helper";
import { formatCurrency } from "../../../utils/currencyUtils";
import { useCurrencyData } from "../../../hooks/useCurrencyData";
import Loader from "../../../components/UI/loader";
import Paginate from "../../../components/UI/paginate";
import ProductCreateModal from "../../../components/product/ProductCreateModal";
import ProductUpdateModal from "../../../components/product/ProductUpdateModal";
import FloatingActionButton from "../../../components/UI/FloatingActionButton";

const ProductTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { products, page, pages, loading } = useAppSelector(
    (state) => state.productFilter
  );
  const { userInfo } = useAppSelector((state) => state.login);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { currency, rates, baseCurrency } = useCurrencyData();
  const params = useParams();
  const pageNumber = params.pageNumber || 1;

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const onDelete = (id: string | number, productName: string) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      authAxios
        .delete(`/products/${id}`)
        .then(() => {
          toast.success("Product has been deleted");
          setRefresh((prev) => !prev);
        })
        .catch((e) => toast.error(setError(e)));
    }
  };

  const handleDelete = (product: any) => {
    onDelete(product._id, product.name);
  };

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleUpdateClose = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    dispatch(getFilterProducts({ n: pageNumber, b: "", c: "", q: "" }));
  }, [dispatch, pageNumber, refresh]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <TableContainer component={Paper} sx={{ my: 4 }}>
          <Table sx={{ minWidth: 650 }} aria-label="admin products table">
            <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                {[
                  "Image",
                  "Name",
                  "Brand",
                  "Category",
                  "Price",
                  "Created At",
                  "Options",
                ].map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      color: "white",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      py: 1,
                      px: 2,
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product: any) => (
                <TableRow
                  key={product._id}
                  hover
                  sx={{
                    "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <TableCell>
                    <Box
                      component="img"
                      src={product.images[0]}
                      alt={product.name}
                      sx={{ width: 50, height: 50, objectFit: "contain" }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "#424242" }}>
                    {product.name}
                  </TableCell>
                  <TableCell sx={{ color: "#424242" }}>
                    {product.brand}
                  </TableCell>
                  <TableCell sx={{ color: "#424242" }}>
                    {product.category}
                  </TableCell>
                  <TableCell sx={{ color: "#424242" }}>
                    {formatCurrency(
                      product.price,
                      currency,
                      rates,
                      baseCurrency
                    )}
                  </TableCell>
                  <TableCell sx={{ color: "#424242" }}>
                    {getDate(new Date(product.createdAt))}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditClick(product)}
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
                        fontSize: { xs: "1.25rem", md: "inherit" },
                        p: { xs: 0.5, md: 1 },
                        m: { xs: 0.5, md: 1 },
                      }}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(product)}
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
                        fontSize: { xs: "1.25rem", md: "inherit" },
                        p: { xs: 0.5, md: 1 },
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ my: 3, mx: { xs: 2, md: 4 } }}>
        <Paginate
          pages={pages}
          page={page}
          isAdmin={true}
          keyword={""}
          urlPrefix="/dashboard/product-list"
        />
      </Box>
      <ProductCreateModal
        setRefresh={setRefresh}
        show={showModal}
        handleClose={closeModal}
      />
      <FloatingActionButton onClick={openModal} />
      {selectedProduct && (
        <ProductUpdateModal
          product={selectedProduct}
          onClose={handleUpdateClose}
        />
      )}
    </>
  );
};

export default ProductTable;
