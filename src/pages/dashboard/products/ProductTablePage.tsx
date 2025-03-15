import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { getFilterProducts } from "../../../redux/products/search-list";
import authAxios from "../../../utils/auth-axios";
import { setError } from "../../../utils/error";
import Loader from "../../../components/UI/loader";
import Paginate from "../../../components/UI/paginate";
import ProductCreateModal from "../../../components/product/ProductCreateModal";
import ProductUpdateModal from "../../../components/product/ProductUpdateModal";
import FloatingActionButton from "../../../components/UI/FloatingActionButton";
import ConfirmationDialog from "../../../components/UI/ConfirmationDialog";
import DataTable, { Column } from "../../../components/UI/DataTable";
import ProductRow from "./ProductRow";
import { Product } from "../../../types/product";

const productColumns: Column[] = [
  { label: "Image", key: "image" },
  { label: "Name", key: "name" },
  { label: "Brand", key: "brand" },
  { label: "Category", key: "category" },
  { label: "Price", key: "price" },
  { label: "Stock", key: "stock" },
  { label: "Total Sales", key: "totalSales" },
  { label: "Added By", key: "addedBy" },
  { label: "Options", key: "options" },
];

const ProductTablePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, page, pages, loading } = useAppSelector(
    (state) => state.productFilter
  );
  const { userInfo } = useAppSelector((state) => state.login);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const params = useParams();
  const pageNumber = params.pageNumber || 1;

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (productToDelete) {
      authAxios
        .delete(`/products/${productToDelete._id}`)
        .then(() => {
          toast.success("Product has been deleted");
          setRefresh((prev) => !prev);
        })
        .catch((e) => toast.error(setError(e)));
    }
    setIsDialogOpen(false);
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
  };

  const handleEditClick = (product: Product) => {
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
        <DataTable columns={productColumns}>
          {products.map((product: Product) => (
            <ProductRow
              key={product._id}
              product={product}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              userInfo={userInfo}
            />
          ))}
        </DataTable>
      )}
      <Box>
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
      <ConfirmationDialog
        open={isDialogOpen}
        title="Confirm Delete"
        content={`Are you sure you want to delete ${productToDelete?.name}?`}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
    </>
  );
};

export default ProductTablePage;
