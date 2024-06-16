import React, { useEffect, useRef, useState } from "react";
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
  IconButton,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import authAxios from "../../../utils/auth-axios";
import toast from "react-hot-toast";
import Loader from "../../../components/UI/loader";
import { setError } from "../../../utils/error";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

type FormValues = {
  name: string;
  images: string[];
  category: string;
  brand: string;
  price: number;
  description: string;
  inStock: boolean;
};

type ProductUpdateProps = {
  product: {
    _id: string;
    name: string;
    images: string[];
    category: string;
    brand: string;
    price: number;
    description: string;
    inStock: boolean;
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
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      description: product.description,
      inStock: product.inStock,
    },
  });

  const [images, setImages] = useState<string[]>(product.images);
  const [uploading, setUploading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    reset({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      description: product.description,
      inStock: product.inStock,
    });
    setImages(product.images);
  }, [product, reset]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (images.length + files.length > 4) {
        toast.error("You can only upload a maximum of 4 images");
        return;
      }

      files.forEach((file, index) => {
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload a valid image file");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size should be less than 5MB");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prevImages) => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const uploadImages = async () => {
    const uploadedImageUrls: string[] = [];

    for (const image of images) {
      if (image.startsWith("data:image/")) {
        const base64Image = image.split(",")[1];
        if (!base64Image) {
          toast.error("Invalid image format");
          return [];
        }

        const byteCharacters = atob(base64Image);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const file = new Blob([byteArray], { type: "image/jpeg" });

        const formData = new FormData();
        formData.append("images", file, "image.jpg");

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
      } else {
        uploadedImageUrls.push(image);
      }
    }

    return uploadedImageUrls;
  };

  const onSubmit = async (data: FormValues) => {
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

  const removeFile = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasMeaningfulChanges = () => {
    const currentValues = watch();
    return (
      currentValues.name.trim() !== product.name ||
      currentValues.category.trim() !== product.category ||
      currentValues.brand.trim() !== product.brand ||
      currentValues.price !== product.price ||
      currentValues.description.trim() !== product.description ||
      images.join(",") !== product.images.join(",") ||
      currentValues.inStock !== product.inStock
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
          sx={{ mt: 1, position: "relative", opacity: formLoading ? 0.5 : 1 }}
        >
          {formLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <Loader />
            </Box>
          )}
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <FormControl fullWidth margin="normal">
            <Box position="relative">
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  width: "150px",
                  mt: 0,
                }}
                disabled={uploading || images.length >= 4}
              >
                Upload
                <input
                  type="file"
                  hidden
                  onChange={onChange}
                  ref={fileInputRef}
                  aria-label="Upload Image"
                  multiple
                />
              </Button>
              {images.length === 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    top: "100%",
                    left: 0,
                    mt: 0.8,
                    ml: 1.8,
                    fontSize: "0.75rem",
                    color: "#d32f2f",
                  }}
                  aria-live="polite"
                >
                  Please upload at least one image
                </Typography>
              )}
            </Box>
            <Box display="flex" flexWrap="wrap" mt={2}>
              {images.map((img, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  mr={2}
                  mb={2}
                  mt={0}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "4px",
                  }}
                >
                  <Tooltip
                    title={
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        style={{ width: 200 }}
                      />
                    }
                  >
                    <Typography
                      variant="body2"
                      style={{
                        cursor: "pointer",
                        marginRight: 8,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        maxWidth: "100px",
                      }}
                    >
                      Image {index + 1}
                    </Typography>
                  </Tooltip>
                  <IconButton
                    onClick={() => removeFile(index)}
                    size="small"
                    color="primary"
                    aria-label="Remove Image"
                  >
                    <DeleteIcon sx={{ color: "#f44336" }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </FormControl>
          <TextField
            label="Brand"
            fullWidth
            margin="normal"
            {...register("brand")}
            error={!!errors.brand}
            helperText={errors.brand?.message}
            sx={{ mt: 0 }}
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
          <FormControlLabel
            control={
              <Checkbox
                {...register("inStock")}
                defaultChecked={product.inStock}
              />
            }
            label="In Stock"
          />
          <DialogActions style={{ marginTop: "10px" }}>
            <Button onClick={onClose} color="primary" aria-label="Cancel">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              aria-label="Update Product"
              disabled={!hasMeaningfulChanges()}
              sx={{
                backgroundColor: hasMeaningfulChanges() ? "#1976d2" : "gray",
                color: "#fff",
              }}
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
