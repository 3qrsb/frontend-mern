import React, { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import authAxios from "../../utils/auth-axios";
import toast from "react-hot-toast";
import { setError } from "../../utils/error";
import { Product } from "../../types/product";
import { useProductForm } from "../../hooks/useProductForm";
import ProductForm, { ProductFormValues } from "./ProductForm";
import FormLoaderOverlay from "../UI/FormLoaderOverlay";
import useUnsavedChanges from "../../hooks/useUnsavedChanges";
import ConfirmationDialog from "../UI/ConfirmationDialog";

type ProductUpdateModalProps = {
  product: Product;
  onClose: () => void;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  category: Yup.string().trim().required("Category is required"),
  brand: Yup.string().trim().required("Brand is required"),
  price: Yup.number()
    .positive("Price must be a positive number")
    .required("Price is required"),
  description: Yup.string().trim().required("Description is required"),
  qty: Yup.number()
    .min(0, "Quantity must be 0 or a positive number")
    .required("Quantity is required"),
});

const ProductUpdateModal: React.FC<ProductUpdateModalProps> = ({
  product,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      description: product.description,
      qty: product.qty,
    },
  });

  const {
    images,
    setImages,
    onFileChange,
    removeImage,
    uploadImages,
    uploading,
    fileInputRef,
  } = useProductForm(product.images);

  const [formLoading, setFormLoading] = React.useState<boolean>(false);

  useEffect(() => {
    reset({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      description: product.description,
      qty: product.qty,
    });
    setImages(product.images);
  }, [product, reset, setImages]);

  const unsavedChanges = useUnsavedChanges(
    watch,
    {
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      description: product.description,
      qty: product.qty,
    },
    images
  );

  const hasMeaningfulChanges = () => unsavedChanges();

  const onSubmitForm = async (data: ProductFormValues) => {
    setFormLoading(true);
    const imageUrls = await uploadImages();
    if (imageUrls.length === 0) {
      setFormLoading(false);
      return;
    }
    const updatedData = { ...data, images: imageUrls };
    try {
      await authAxios.put(`/products/${product._id}`, updatedData);
      toast.success("Product has been updated");
      onClose();
    } catch (err: any) {
      toast.error(setError(err));
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <Dialog open onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: "center", color: "primary.main" }}>
          Update Product
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitForm)}
            noValidate
            sx={{ mt: 1, position: "relative", opacity: formLoading ? 0.5 : 1 }}
          >
            {formLoading && <FormLoaderOverlay />}
            <ProductForm
              register={register}
              errors={errors}
              onFileChange={onFileChange}
              images={images}
              removeImage={removeImage}
              fileInputRef={fileInputRef}
              uploading={uploading}
            />
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={onClose} color="primary" aria-label="Cancel">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                aria-label="Update Product"
                disabled={!hasMeaningfulChanges()}
                sx={{
                  backgroundColor: hasMeaningfulChanges()
                    ? "primary.main"
                    : "grey",
                  color: "#fff",
                }}
              >
                Update
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        open={false}
        content="Are you sure you want to close the form? All unsaved changes will be lost."
        onCancel={() => {}}
        onConfirm={() => onClose()}
      />
    </>
  );
};

export default ProductUpdateModal;
