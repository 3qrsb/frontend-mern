import { useState } from "react";
import authAxios from "./auth-axios";
import { baseUrl } from "./helper";
import toast from "react-hot-toast";
import { setError } from "./error";

export const useImageUpload = () => {
  const [fileName, setFileName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const uploadImage = async (file: File) => {
    let formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await authAxios.post("/uploads/image", formData);
      if (res.data) {
        setImage(`${baseUrl}${res.data}`);
        toast.success("Image uploaded successfully");
      }
    } catch (err) {
      toast.error(setError(err as Error));
    } finally {
      setUploading(false);
    }
  };

  const resetImage = () => {
    setFileName("");
    setImage("");
  };

  return { fileName, setFileName, image, uploading, uploadImage, resetImage };
};