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
import { ChangeEvent, useRef, useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import authAxios from "../../utils/auth-axios";
import { setError } from "../../utils/error";
import React from "react";

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
  const [fileName, setFileName] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      newFiles.forEach((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload a valid image file");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size should be less than 5MB");
          return;
        }
      });

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setImageError("");
    }
  };

  const uploadImages = async () => {
    const uploadedImageUrls: string[] = [];
  
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));
  
    setUploading(true);
    try {
      const res = await authAxios.post("/uploads/image", formData);
      if (res.data.urls) {
        uploadedImageUrls.push(...res.data.urls);
      }
    } catch (err) {
      toast.error(setError(err as Error));
      return [];
    } finally {
      setUploading(false);
    }
  
    return uploadedImageUrls;
  };

  const onSubmit = async (data: FormValues) => {
    const imageUrls = await uploadImages();
    if (imageUrls.length === 0) return;

    try {
      await authAxios.post("/products", { ...data, images: imageUrls });
      toast.success("Product has been created");
      setRefresh((prev: any) => !prev);
      handleClose();
    } catch (err: any) {
      toast.error(setError(err));
    }
  };

  const removeFile = () => {
    setFileName("");
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImageError("");
  };

  const hasUnsavedChanges = () => {
    const formValues = getValues();
    return (
      Object.values(formValues).some((value) => value !== "") ||
      files.length > 0
    );
  };

  const handleCloseWithConfirmation = () => {
    if (hasUnsavedChanges()) {
      setOpenConfirm(true);
    } else {
      handleClose();
    }
  };

  const handleConfirmClose = (confirmed: boolean) => {
    setOpenConfirm(false);
    if (confirmed) {
      reset();
      removeFile();
      handleClose();
    }
  };

  useEffect(() => {
    if (!show) {
      reset();
      removeFile();
      setImageError("");
    }
  }, [show, reset]);

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
                  multiple
                />
              </Button>
              {files.map((file, index) => (
                <Box key={index} mt={2} display="flex" alignItems="center">
                  <Tooltip
                    title={
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        style={{ width: 200 }}
                      />
                    }
                  >
                    <Typography
                      variant="body2"
                      style={{ cursor: "pointer", marginRight: 8 }}
                    >
                      Image {index + 1}
                    </Typography>
                  </Tooltip>
                  <IconButton
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                    size="small"
                    color="primary"
                    aria-label="Remove Image"
                  >
                    <DeleteIcon style={{ color: "#f44336" }} />
                  </IconButton>
                </Box>
              ))}
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
