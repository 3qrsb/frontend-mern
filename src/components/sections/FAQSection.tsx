import React from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQSection: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{ py: { xs: 10, sm: 16, lg: 24 }, backgroundColor: "grey.50" }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", maxWidth: 640, mx: "auto" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: "black",
              fontSize: { xs: "2rem", sm: "2.5rem", lg: "3rem" },
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, color: "grey.600", maxWidth: 480, mx: "auto" }}
          >
            Got questions about our gadgets? We’ve got you covered.
          </Typography>
        </Box>

        {/* FAQ Items */}
        <Box sx={{ mt: { xs: 8, md: 16 }, maxWidth: 960, mx: "auto" }}>
          <Accordion
            slotProps={{ transition: { unmountOnExit: true } }}
            defaultExpanded
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                How do I create an account?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                Creating an account is simple. Just click on the "Sign Up"
                button at the top-right corner, fill in your details, and verify
                your email address.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                What payment methods do you accept?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                We accept a range of payment methods including major
                credit/debit cards, PayPal, and more. All transactions are
                processed securely.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                How can I track my order?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                Once your order is shipped, you will receive a tracking number
                via email. You can also check the status in your account’s order
                history.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                What is your return policy?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                We offer a 30-day return policy on most products. Please review
                our{" "}
                <Link
                  href="#"
                  sx={{
                    color: "blue.600",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  return policy
                </Link>{" "}
                for complete details and any exceptions.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                Do your gadgets come with a warranty?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                Yes, all our products come with a manufacturer warranty.
                Extended warranty options are available at checkout for added
                peace of mind.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                How do I contact customer support?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                Our support team is here to help. You can reach us via our{" "}
                <Link
                  href="#"
                  sx={{
                    color: "blue.600",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  contact page
                </Link>{" "}
                or by calling our support hotline.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Contact Support */}
        <Typography
          variant="body2"
          sx={{ mt: 9, textAlign: "center", color: "grey.600" }}
        >
          Didn’t find the answer you are looking for?{" "}
          <Link
            href="#"
            sx={{
              fontWeight: 500,
              color: "blue.600",
              transition: "all 0.2s",
              textDecoration: "none",
              "&:hover": { color: "blue.700", textDecoration: "underline" },
            }}
          >
            Contact our support
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default FAQSection;
