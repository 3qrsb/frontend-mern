import React, { useEffect, useState } from "react";
import {
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { getFilterProducts } from "../../../redux/products/search-list";
import authAxios from "../../../utils/auth-axios";
import { setError } from "../../../utils/error";
import { formatCurrencry, getDate } from "../../../utils/helper";
import { FaEdit, FaTrash } from "react-icons/fa";
import Loader from "../../../components/UI/loader";
import Paginate from "../../../components/UI/paginate";
import toast from "react-hot-toast";
import ProductModal from "../../../components/product/ProductModal";
import ProductUpdate from "../../../components/product/ProductUpdate";
import { ReviewTypes } from "../../../types/review";

const ProductTable = () => {
  const dispatch = useAppDispatch();
  const { products, page, pages, loading } = useAppSelector(
    (state) => state.productFilter
  );
  const { userInfo } = useAppSelector((state) => state.login);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const params = useParams();
  const pageNumber = params.pageNumber || 1;

  const onOpen = () => setShow(true);
  const onClose = () => setShow(false);

  const onDelete = (id: string | number, productName: string) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      authAxios
        .delete(`/products/${id}`)
        .then((res) => {
          toast.success("Product has been deleted");
          setRefresh((prev) => !prev);
        })
        .catch((e) => toast.error(setError(e)));
    }
  };

  const handleDelete = (product: {
    _id: any;
    name: any;
    price?: number;
    images?: string[];
    category?: string;
    brand?: string;
    description?: string;
    qty?: number;
    createdAt?: Date;
    reviews?: ReviewTypes[];
    user: string;
  }) => {
    const productName = product.name;
    onDelete(product._id, productName);
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

  const cols = [
    "Image",
    "Name",
    "Brand",
    "Category",
    "Price",
    "Created At",
    "Options",
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Card className="mt-6 mb-6">
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#c62828" }}>
                <TableRow>
                  {cols.map((col: any) => (
                    <TableCell
                      key={col}
                      sx={{
                        color: "white",
                        textTransform: "uppercase",
                        fontWeight: "normal",
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
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <img
                        src={product.images[0]}
                        alt="Product"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "gray" }}>{product.name}</TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {product.brand}
                    </TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {product.category}
                    </TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {formatCurrencry(product.price)}
                    </TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {getDate(new Date(product.createdAt))}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEditClick(product)}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          backgroundColor:
                            userInfo?._id === product.user || userInfo?.isAdmin
                              ? "#1976d2"
                              : "grey",
                          color: "white",
                          pointerEvents:
                            userInfo?._id === product.user || userInfo?.isAdmin
                              ? "auto"
                              : "none",
                          "&:hover": {
                            backgroundColor:
                              userInfo?._id === product.user ||
                              userInfo?.isAdmin
                                ? "#1565c0"
                                : "grey",
                            color: "white",
                          },
                        }}
                      >
                        <FaEdit />
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
                          pointerEvents:
                            userInfo?._id === product.user || userInfo?.isAdmin
                              ? "auto"
                              : "none",
                          "&:hover": {
                            backgroundColor:
                              userInfo?._id === product.user ||
                              userInfo?.isAdmin
                                ? "#c62828"
                                : "grey",
                            color: "white",
                          },
                          ml: 1,
                          borderRadius: 2,
                        }}
                      >
                        <FaTrash />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
      <div style={{ margin: "25px 0" }}>
        <Paginate
          pages={pages}
          page={page}
          isAdmin={true}
          keyword={""}
          urlPrefix="/dashboard/product-list"
        />
      </div>
      <ProductModal setRefresh={setRefresh} show={show} handleClose={onClose} />
      {selectedProduct && (
        <ProductUpdate product={selectedProduct} onClose={handleUpdateClose} />
      )}
    </>
  );
};

export default ProductTable;
