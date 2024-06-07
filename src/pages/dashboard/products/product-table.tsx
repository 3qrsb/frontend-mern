import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { getFilterProducts } from "../../../redux/products/search-list";
import authAxios from "../../../utils/auth-axios";
import { setError } from "../../../utils/error";
import { formatCurrencry, getDate } from "../../../utils/helper";
import { FaEdit, FaTrash } from "react-icons/fa";
import Loader from "../../../components/UI/loader";
import Paginate from "../../../components/UI/paginate";
import toast from "react-hot-toast";
import ProductModal from "../../../components/modals/product-modal";
import { ReviewTypes } from "../../../utils/interfaces";

function ProductTable() {
  const dispatch = useAppDispatch();
  const { products, page, pages, loading } = useAppSelector(
    (state) => state.productFilter
  );
  const [refresh, setRefresh] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
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
          setRefresh((prev) => (prev = !prev));
        })
        .catch((e) => toast.error(setError(e)));
    }
  };

  const handleDelete = (product: {
    _id: any;
    name: any;
    price?: number;
    image?: string;
    category?: string;
    brand?: string;
    description?: string;
    qty?: number;
    createdAt?: Date;
    reviews?: ReviewTypes[];
  }) => {
    const productName = product.name;
    onDelete(product._id, productName);
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
        <Card className="mt-5 mb-5">
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
                        src={product.image}
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
                      {getDate(product.createdAt)}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/dashboard/product-edit/${product._id}`}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#1976d2",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#1565c0",
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
                          backgroundColor: "#ef5350",
                          color: "white",
                          "&:hover": { backgroundColor: "#c62828" },
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
      <div style={{ margin: "20px 0" }}>
        <Paginate
          pages={pages}
          page={page}
          isAdmin={true}
          keyword={""}
          urlPrefix="/dashboard/product-list"
        />
      </div>
      <ProductModal setRefresh={setRefresh} show={show} handleClose={onClose} />
    </>
  );
}

export default ProductTable;
