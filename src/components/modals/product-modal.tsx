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
import Loader from "../UI/loader";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
};

type FormValues = {
  name: string;
  images: string[];
  category: string;
  brand: string;
  price: number | null;
  description: string;
  inStock: boolean;
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
  images: Yup.array().min(1, "Image is required").required("Image is required"),
});

const defaultValues: FormValues = {
  name: "",
  images: [],
  category: "",
  brand: "",
  price: null,
  description: "",
  inStock: true,
};

const ProductModal = ({ show, handleClose, setRefresh }: Props) => {
  const [fileName, setFileName] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    clearErrors,
    setValue,
    formState: { errors, isDirty, isSubmitted },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + images.length > 4) {
        toast.error("You can only upload up to 4 images");
        return;
      }

      files.forEach((file) => {
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
          setImages((prevImages) => {
            const newImages = [...prevImages, reader.result as string];
            setValue("images", newImages, { shouldValidate: true });
            return newImages;
          });
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
    if (images.length === 0) {
      setValue("images", []);
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
      setRefresh((prev: any) => !prev);
      handleClose();
    } catch (err: any) {
      toast.error(setError(err));
    } finally {
      setFormLoading(false);
    }
  };

  const removeFile = (index: number) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter((_, i) => i !== index);
      setValue("images", newImages, { shouldValidate: true });
      return newImages;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!show) {
      reset(defaultValues);
      setImages([]);
    }
  }, [show, reset]);

  const hasUnsavedChanges = () => {
    const currentValues = getValues();
    const hasChanges = Object.keys(defaultValues).some((key) => {
      if (key === "images") {
        return images.length > 0;
      }
      return (
        currentValues[key as keyof FormValues] !==
        defaultValues[key as keyof FormValues]
      );
    });

    return hasChanges;
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
      reset(defaultValues);
      setImages([]);
      handleClose();
    }
  };

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
                {errors.images && (
                  <Typography
                    variant="body2"
                    sx={{
                      top: "100%",
                      left: 0,
                      mt: 1,
                      ml: "15px",
                      fontSize: "0.75rem",
                      color: "#d32f2f",
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
            <FormControl fullWidth margin="normal" sx={{ mt: 0 }}>
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
                  min: undefined,
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
            <FormControlLabel
              control={<Checkbox {...register("inStock")} defaultChecked />}
              label="In Stock"
            />
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
                disabled={formLoading}
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
