import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";

type FormTextFieldProps = Omit<TextFieldProps, "InputProps"> & {
  icon?: React.ReactNode;
};

const FormTextField = React.forwardRef<HTMLInputElement, FormTextFieldProps>(
  ({ icon, slotProps, ...props }, ref) => {
    return (
      <TextField
        {...props}
        inputRef={ref}
        slotProps={{
          input: {
            ...slotProps?.input,
            startAdornment: icon ? (
              <InputAdornment position="start">{icon}</InputAdornment>
            ) : undefined,
          },
        }}
      />
    );
  }
);

FormTextField.displayName = "FormTextField";

export default FormTextField;
