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
import { useProductForm } from "../../hooks/useProductForm";
import ProductForm, { ProductFormValues } from "./ProductForm";
import FormLoaderOverlay from "../UI/FormLoaderOverlay";
import ConfirmationDialog from "../UI/ConfirmationDialog";
import useUnsavedChanges from "../../hooks/useUnsavedChanges";

type ProductCreateModalProps = {
  show: boolean;
  handleClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValues: ProductFormValues = {
  name: "",
  category: "",
  brand: "",
  price: 0,
  description: "",
  qty: 0,
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  category: Yup.string().required("Category is required"),
  brand: Yup.string().required("Brand is required"),
  price: Yup.number()
    .typeError("Price is required")
    .positive("Price must be a positive number")
    .required("Price is required"),
  description: Yup.string().required("Description is required"),
  qty: Yup.number()
    .typeError("Quantity is required")
    .required("Quantity is required")
    .min(0, "Quantity must be 0 or a positive number"),
});

const ProductCreateModal: React.FC<ProductCreateModalProps> = ({
  show,
  handleClose,
  setRefresh,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    images,
    setImages,
    onFileChange,
    removeImage,
    uploadImages,
    uploading,
    fileInputRef,
  } = useProductForm();

  const [formLoading, setFormLoading] = React.useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);

  useEffect(() => {
    if (!show) {
      reset(defaultValues);
      setImages([]);
    }
  }, [show, reset, setImages]);

  const unsavedChanges = useUnsavedChanges(getValues, defaultValues, images);

  const onSubmitForm = async (data: ProductFormValues) => {
    setFormLoading(true);
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      setFormLoading(false);
      return;
    }
    const imageUrls = await uploadImages();
    if (imageUrls.length === 0) {
      setFormLoading(false);
      return;
    }
    try {
      await authAxios.post("/products", { ...data, images: imageUrls });
      toast.success("Product has been created");
      setRefresh((prev) => !prev);
      handleClose();
    } catch (err: any) {
      toast.error(setError(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseWithConfirmation = () => {
    if (unsavedChanges()) {
      setOpenConfirm(true);
    } else {
      handleClose();
    }
  };

  const handleConfirmClose = (confirmed: boolean) => {
    setOpenConfirm(false);
    if (confirmed) {
      reset(defaultValues);
      setImages([]);
      handleClose();
    }
  };

  return (
    <>
      <Dialog
        open={show}
        onClose={handleCloseWithConfirmation}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center", color: "primary.main" }}>
          New Product
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
              <Button
                onClick={handleCloseWithConfirmation}
                color="primary"
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                aria-label="Add Product"
                disabled={formLoading}
                sx={{ backgroundColor: "primary.main", color: "#fff" }}
              >
                Add Product
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        open={openConfirm}
        title="Confirm Reset"
        content="Are you sure you want to close the form? All unsaved changes will be lost."
        onCancel={() => handleConfirmClose(false)}
        onConfirm={() => handleConfirmClose(true)}
      />
    </>
  );
};

export default ProductCreateModal;
