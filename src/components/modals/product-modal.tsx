import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import React from "react";
import { useImageUpload } from "../../utils/useImageUpload";
import authAxios from "../../utils/auth-axios";
import { setError } from "../../utils/error";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
};

type FormValues = {
  name: string;
  image: string;
  category: string;
  brand: string;
  price: number;
  description: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  category: Yup.string().required("Category is required"),
  brand: Yup.string().required("Brand is required"),
  price: Yup.number()
    .positive("Price must be a positive number")
    .required("Price is required"),
  description: Yup.string().required("Description is required"),
});

const ProductModal = ({ show, handleClose, setRefresh }: Props) => {
  const { fileName, setFileName, image, uploading, uploadImage, resetImage } =
    useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageError, setImageError] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleConfirmClose = (confirmed: boolean) => {
    setOpenConfirm(false);
    if (confirmed) {
      reset();
      resetImage();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImageError("");
      handleClose();
    }
  };

  const hasUnsavedChanges = () => {
    const formValues = getValues();
    return (
      Object.values(formValues).some((value) => value !== "") || !!fileName
    );
  };

  const handleCloseWithConfirmation = () => {
    if (hasUnsavedChanges()) {
      setOpenConfirm(true);
    } else {
      handleClose();
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setFileName(file.name);
      await uploadImage(file);
      setImageError("");
    }
  };

  const removeFile = () => {
    resetImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImageError("");
  };

  const onSubmit = async (data: FormValues) => {
    if (!image) {
      setImageError("Image is required");
      toast.error("Please upload an image");
      return;
    }

    try {
      await authAxios.post("/products", { ...data, image });
      toast.success("Product has been created");
      setRefresh((prev: any) => !prev);
      handleClose();
    } catch (err: any) {
      if (err.response && err.response.data) {
        toast.error(`Error: ${err.response.data.message}`);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  useEffect(() => {
    if (!show) {
      reset();
      resetImage();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImageError(""); // Clear image error when dialog is closed
    }
  }, [show, reset, resetImage]);

  return (
    <>
      <Dialog open={show} onClose={handleCloseWithConfirmation}>
        <DialogTitle style={{ textAlign: "center", color: "#1976d2" }}>
          New Product
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <FormControl fullWidth margin="normal">
              <TextField
                label="Name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                inputProps={{ "aria-label": "Product Name" }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                style={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  marginTop: "0",
                  width: "150px",
                }}
                disabled={uploading}
              >
                {uploading ? <CircularProgress size={24} /> : "Upload"}
                <input
                  type="file"
                  hidden
                  onChange={onChange}
                  ref={fileInputRef}
                  aria-label="Upload Image"
                />
              </Button>
              {fileName && (
                <Box mt={2} display="flex" alignItems="center">
                  <Tooltip
                    title={
                      <img src={image} alt="Preview" style={{ width: 200 }} />
                    }
                  >
                    <Typography
                      variant="body2"
                      style={{ cursor: "pointer", marginRight: 8 }}
                    >
                      {fileName}
                    </Typography>
                  </Tooltip>
                  <IconButton
                    onClick={removeFile}
                    size="small"
                    color="primary"
                    aria-label="Remove Image"
                  >
                    <DeleteIcon style={{ color: "#f44336" }} />
                  </IconButton>
                </Box>
              )}
              {imageError && (
                <Typography
                  variant="body2"
                  color="error"
                  mt={2}
                  aria-live="polite"
                >
                  {imageError}
                </Typography>
              )}
              <Typography variant="body2" color="primary" aria-live="polite">
                {uploading ? "Uploading..." : ""}
              </Typography>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Brand"
                {...register("brand")}
                error={!!errors.brand}
                helperText={errors.brand?.message}
                inputProps={{ "aria-label": "Product Brand" }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Category"
                {...register("category")}
                error={!!errors.category}
                helperText={errors.category?.message}
                inputProps={{ "aria-label": "Product Category" }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Price"
                type="number"
                {...register("price")}
                error={!!errors.price}
                helperText={errors.price?.message}
                inputProps={{
                  min: 0,
                  step: 0.01,
                  "aria-label": "Product Price",
                }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Description"
                {...register("description")}
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
                inputProps={{ "aria-label": "Product Description" }}
              />
            </FormControl>
            <DialogActions style={{ marginTop: "10px" }}>
              <Button
                onClick={handleCloseWithConfirmation}
                color="primary"
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: "#1976d2", color: "#fff" }}
                variant="contained"
                aria-label="Add Product"
              >
                Add Product
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={openConfirm} onClose={() => handleConfirmClose(false)}>
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to close the form? All unsaved changes will be
            lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmClose(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => handleConfirmClose(true)}
            color="primary"
            variant="contained"
            style={{ backgroundColor: "#1976d2", color: "#fff" }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductModal;
