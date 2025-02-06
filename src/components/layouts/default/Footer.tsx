import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "grey.900",
        color: "grey.100",
        py: 4,
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Company Name
            </Typography>
            <Typography variant="body2">
              We are a modern company providing high-quality products and
              excellent customer service.
            </Typography>
          </Grid>
          {/* Useful Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Useful Links
            </Typography>
            <Box>
              <Link
                href="/"
                color="inherit"
                underline="hover"
                variant="body2"
                display="block"
              >
                Home
              </Link>
              <Link
                href="/products"
                color="inherit"
                underline="hover"
                variant="body2"
                display="block"
              >
                Products
              </Link>
              <Link
                href="/contact"
                color="inherit"
                underline="hover"
                variant="body2"
                display="block"
              >
                Contact
              </Link>
              <Link
                href="/about"
                color="inherit"
                underline="hover"
                variant="body2"
                display="block"
              >
                About Us
              </Link>
            </Box>
          </Grid>
          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              123 Main Street
              <br />
              City, Country
              <br />
              Email: info@example.com
              <br />
              Phone: +1 234 567 890
            </Typography>
          </Grid>
          {/* Social Media */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton
                href="https://www.facebook.com"
                target="_blank"
                color="inherit"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href="https://www.twitter.com"
                target="_blank"
                color="inherit"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                href="https://www.instagram.com"
                target="_blank"
                color="inherit"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                href="https://www.linkedin.com"
                target="_blank"
                color="inherit"
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Company Name. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
