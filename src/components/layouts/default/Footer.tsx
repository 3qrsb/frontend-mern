import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        py: theme.spacing(4),
        mt: theme.spacing(4),
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={theme.spacing(4)}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Name
            </Typography>
            <Typography variant="body2">
              We are a modern company providing high-quality products and
              excellent customer service.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Useful Links
            </Typography>
            <Box>
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/contact", label: "Contact" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  color="inherit"
                  underline="hover"
                  variant="body2"
                  display="block"
                  sx={{
                    transition: theme.transitions.create("color"),
                    "&:hover, &.active": {
                      color: theme.palette.secondary.main,
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              {[
                { href: "https://www.facebook.com", icon: <FacebookIcon /> },
                { href: "https://www.twitter.com", icon: <TwitterIcon /> },
                { href: "https://www.instagram.com", icon: <InstagramIcon /> },
                { href: "https://www.linkedin.com", icon: <LinkedInIcon /> },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  href={social.href}
                  target="_blank"
                  color="inherit"
                  sx={{
                    transition: theme.transitions.create("color"),
                    "&:hover": { color: theme.palette.secondary.main },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: "center", mt: theme.spacing(4) }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Company Name. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
