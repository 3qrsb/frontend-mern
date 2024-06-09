import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import authAxios from "../../../utils/auth-axios";
import toast from "react-hot-toast";
import { setError } from "../../../utils/error";
import React, { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

type FormValues = {
  name: string;
  image: string;
  category: string;
  brand: string;
  price: number;
  description: string;
};

type ProductUpdateProps = {
  product: {
    _id: string;
    name: string;
    image: string;
    category: string;
    brand: string;
    price: number;
    description: string;
  };
  onClose: () => void;
};

const ProductUpdate: React.FC<ProductUpdateProps> = ({ product, onClose }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    category: Yup.string().trim().required("Category is required"),
    brand: Yup.string().trim().required("Brand is required"),
    price: Yup.number()
      .positive("Price must be a positive number")
      .required("Price is required"),
    description: Yup.string().trim().required("Description is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      description: product.description,
    },
  });

  const [fileName, setFileName] = useState(product.image);
  const [uploading, setUploading] = useState(false);
  const baseUrl = "http://localhost:4000";

  useEffect(() => {
    reset({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      description: product.description,
    });
    const formattedImage = product.image.startsWith("http")
      ? product.image
      : `${baseUrl}/${product.image}`;
    setFileName(formattedImage.replace(/\\/g, "/")); // Replace backslashes with forward slashes
  }, [product, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!fileName) {
      toast.error("Please upload an image");
      return;
    }
    const updatedData = { ...data, image: fileName };
    try {
      await authAxios.put(`/products/${product._id}`, updatedData);
      toast.success("Product has been updated");
      onClose();
    } catch (err: any) {
      toast.error(setError(err));
    }
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      // Validate the file type and size
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("image", file);
        const { data } = await authAxios.post("/uploads/image", formData);
        const fullImageUrl = `${baseUrl}${data}`.replace(/\\/g, "/"); // Ensure correct URL format
        setFileName(fullImageUrl);
        setValue("image", fullImageUrl);
        toast.success("Image uploaded successfully");
      } catch (err: any) {
        toast.error(setError(err));
      } finally {
        setUploading(false);
      }
    }
  };

  const removeFile = () => {
    setFileName("");
    setValue("image", "");
  };

  const isFormDirty = () => {
    const currentValues = watch();
    return (
      isDirty ||
      currentValues.name.trim() !== product.name.trim() ||
      currentValues.category.trim() !== product.category.trim() ||
      currentValues.brand.trim() !== product.brand.trim() ||
      currentValues.price !== product.price ||
      currentValues.description.trim() !== product.description.trim() ||
      fileName !== product.image
    );
  };

  const hasMeaningfulChanges = () => {
    const currentValues = watch();
    return (
      currentValues.name.trim() !== product.name ||
      currentValues.category.trim() !== product.category ||
      currentValues.brand.trim() !== product.brand ||
      currentValues.price !== product.price ||
      currentValues.description.trim() !== product.description ||
      fileName !== product.image
    );
  };

  return (
    <Dialog open={Boolean(product)} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle style={{ textAlign: "center", color: "#1976d2" }}>
        Update Product
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
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
                aria-label="Upload Image"
              />
            </Button>
            {fileName && (
              <Box mt={2} display="flex" alignItems="center">
                <Tooltip
                  title={
                    <img src={fileName} alt="Preview" style={{ width: 200 }} />
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
                  color="secondary"
                  aria-label="Remove Image"
                >
                  <DeleteIcon style={{ color: "#f44336" }} />
                </IconButton>
              </Box>
            )}
            {!fileName && (
              <Typography
                variant="body2"
                color="error"
                mt={2}
                aria-live="polite"
              >
                Please upload an image
              </Typography>
            )}
          </FormControl>
          <TextField
            label="Brand"
            fullWidth
            margin="normal"
            {...register("brand")}
            error={!!errors.brand}
            helperText={errors.brand?.message}
          />
          <TextField
            label="Category"
            fullWidth
            margin="normal"
            {...register("category")}
            error={!!errors.category}
            helperText={errors.category?.message}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            {...register("price")}
            error={!!errors.price}
            helperText={errors.price?.message}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <DialogActions style={{ marginTop: "10px" }}>
            <Button onClick={onClose} color="primary" aria-label="Cancel">
              Cancel
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: "#1976d2", color: "#fff" }}
              variant="contained"
              aria-label="Update Product"
              disabled={!hasMeaningfulChanges()}
            >
              Update
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductUpdate;
