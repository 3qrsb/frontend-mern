import { useCallback } from "react";
import { ProductFormValues } from "../components/product/ProductForm";

const useUnsavedChanges = (
  getValues: () => ProductFormValues,
  defaultValues: ProductFormValues,
  images: string[]
): (() => boolean) => {
  return useCallback(() => {
    const currentValues = getValues();
    const hasChanges = Object.keys(defaultValues).some(
      (key) =>
        currentValues[key as keyof ProductFormValues] !==
        defaultValues[key as keyof ProductFormValues]
    );
    return hasChanges || images.length > 0;
  }, [getValues, defaultValues, images]);
};

export default useUnsavedChanges;
