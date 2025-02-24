import { useState, useRef, ChangeEvent } from "react";
import toast from "react-hot-toast";
import authAxios from "../utils/auth-axios";
import { setError } from "../utils/error";

export const useProductForm = (initialImages: string[] = []) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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
          if (reader.result) {
            setImages((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (const image of images) {
      if (image.startsWith("data:image/")) {
        const base64Image = image.split(",")[1];
        if (!base64Image) {
          toast.error("Invalid image format");
          return [];
        }
        try {
          setUploading(true);
          const formData = new FormData();
          const byteCharacters = atob(base64Image);
          const byteNumbers = new Array(byteCharacters.length)
            .fill(0)
            .map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
          formData.append("images", blob, "image.jpg");
          const res = await authAxios.post("/uploads/image", formData);
          if (res.data.urls) {
            uploadedUrls.push(...res.data.urls);
          }
        } catch (err) {
          toast.error(setError(err as Error));
          return [];
        } finally {
          setUploading(false);
        }
      } else {
        uploadedUrls.push(image);
      }
    }
    return uploadedUrls;
  };

  return {
    images,
    setImages,
    onFileChange,
    removeImage,
    uploadImages,
    uploading,
    fileInputRef,
  };
};
