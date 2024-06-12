import React, { ReactNode } from "react";
import { Container, Card, CardContent, Typography, Grid } from "@mui/material";
import DefaultLayout from "../layouts/default-layout";

type FormTypes = {
  children: ReactNode;
  title: string;
  meta?: string;
};

const FormContainer = (props: FormTypes) => {
  return (
    <DefaultLayout title={props.meta}>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Card>
          <Typography
            variant="h4"
            color="#e03a3c"
            align="center"
            gutterBottom
            mt={3}
          >
            {props.title}
          </Typography>
          <CardContent>{props.children}</CardContent>
        </Card>
      </Container>
    </DefaultLayout>
  );
};

export default FormContainer;
