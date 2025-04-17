import React from "react";
import DefaultLayout from "../../components/layouts/default/DefaultLayout";
import PaymentResult from "./PaymentResult";

const SuccessPage: React.FC = () => (
  <DefaultLayout title="Payment Successful">
    <PaymentResult status="success" />
  </DefaultLayout>
);

export default SuccessPage;
