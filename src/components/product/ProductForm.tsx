import React from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

export type ProductFormValues = {
  name: string;
  category: string;
  brand: string;
  price: number;
  description: string;
  qty: number;
};

type ProductFormProps = {
  register: any;
  errors: any;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  images: string[];
  removeImage: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  uploading: boolean;
};

const ProductForm: React.FC<ProductFormProps> = ({
  register,
  errors,
  onFileChange,
  images,
  removeImage,
  fileInputRef,
  uploading,
}) => {
  return (
    <>
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
        <Box sx={{ position: "relative" }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ width: 150 }}
            disabled={uploading || images.length >= 4}
          >
            Upload
            <input
              type="file"
              hidden
              onChange={onFileChange}
              ref={fileInputRef}
              multiple
              accept="image/*"
              aria-label="Upload Image"
            />
          </Button>
          {errors.images && (
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                mt: 1,
                ml: 2,
                fontSize: "0.75rem",
                color: "error.main",
              }}
              aria-live="polite"
            >
              {errors.images.message}
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
              sx={{ border: "1px solid #ddd", borderRadius: 1, p: 1 }}
            >
              <Tooltip
                title={
                  <Box
                    component="img"
                    src={img}
                    alt={`Image ${index + 1}`}
                    sx={{ width: 200 }}
                  />
                }
              >
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    mr: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 100,
                  }}
                >
                  Image {index + 1}
                </Typography>
              </Tooltip>
              <IconButton
                onClick={() => removeImage(index)}
                size="small"
                aria-label="Remove Image"
              >
                <DeleteIcon sx={{ color: "error.main" }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Brand"
          {...register("brand")}
          error={!!errors.brand}
          helperText={errors.brand?.message}
          sx={{ mt: 0 }}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Category"
          {...register("category")}
          error={!!errors.category}
          helperText={errors.category?.message}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Price"
          type="number"
          {...register("price")}
          error={!!errors.price}
          helperText={errors.price?.message}
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
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Quantity"
          type="number"
          {...register("qty")}
          error={!!errors.qty}
          helperText={errors.qty?.message}
        />
      </FormControl>
    </>
  );
};

export default ProductForm;
