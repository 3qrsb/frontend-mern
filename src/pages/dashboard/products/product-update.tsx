import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAppSelector } from "../../../redux";
import { useNavigate, useParams } from "react-router-dom";
import authAxios from "../../../utils/auth-axios";
import toast from "react-hot-toast";
import { setError } from "../../../utils/error";
import React, { useEffect } from "react";

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
    name: Yup.string().required("Name is required"),
    image: Yup.string().required("Image URL is required"),
    category: Yup.string().required("Category is required"),
    brand: Yup.string().required("Brand is required"),
    price: Yup.number()
      .positive("Price must be a positive number")
      .required("Price is required"),
    description: Yup.string().required("Description is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: product.name,
      image: product.image,
      category: product.category,
      brand: product.brand,
      price: product.price,
      description: product.description,
    },
  });

  useEffect(() => {
    reset({
      name: product.name,
      image: product.image,
      category: product.category,
      brand: product.brand,
      price: product.price,
      description: product.description,
    });
  }, [product, reset]);

  const onSubmit = (data: FormValues) => {
    authAxios
      .put(`/products/${product._id}`, data)
      .then((res) => {
        toast.success("Product has been updated");
        onClose();
      })
      .catch((err) => toast.error(setError(err)));
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
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            {...register("image")}
            error={!!errors.image}
            helperText={errors.image?.message}
          />
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
          <DialogActions>
            <Button onClick={onClose} color="primary" aria-label="Cancel">
              Cancel
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: "#1976d2", color: "#fff" }}
              variant="contained"
              aria-label="Update Product"
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
