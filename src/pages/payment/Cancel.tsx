import React from "react";
import DefaultLayout from "../../components/layouts/default/DefaultLayout";
import PaymentResult from "./PaymentResult";

const CancelPage: React.FC = () => (
  <DefaultLayout title="Payment Cancelled">
    <PaymentResult status="cancel" />
  </DefaultLayout>
);

export default CancelPage;
