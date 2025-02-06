import React from "react";
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DefaultLayout from "../components/layouts/default/DefaultLayout";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
}));

const teamMembers = [
  {
    name: "Alice Johnson",
    role: "CEO",
    bio: "Alice is a visionary leader who drives our innovation with passion and commitment.",
  },
  {
    name: "Bob Smith",
    role: "CTO",
    bio: "Bob leads our technology strategy, ensuring we remain at the forefront of industry trends.",
  },
  {
    name: "Carol White",
    role: "CMO",
    bio: "Carol brings creative energy and strategic insights to our marketing efforts.",
  },
];

const AboutPage = () => {
  return (
    <DefaultLayout title="About Us">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={1000}>
          <Box>
            <Typography variant="h3" align="center" gutterBottom>
              About Us
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Discover our story, mission, and the team behind our success.
            </Typography>

            <StyledPaper sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Our Story
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Founded in 2020, our company began with a simple idea: to create
                innovative solutions that bridge the gap between technology and
                everyday needs. Over time, our small but dedicated team has
                grown into a dynamic organization driven by passion, creativity,
                and a relentless commitment to excellence.
              </Typography>
            </StyledPaper>

            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <StyledPaper>
                  <Typography variant="h5" gutterBottom>
                    Our Mission
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    To empower individuals and organizations by delivering
                    cutting-edge technology solutions that foster innovation,
                    efficiency, and connectivity.
                  </Typography>
                </StyledPaper>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledPaper>
                  <Typography variant="h5" gutterBottom>
                    Our Vision
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    To create a world where technology seamlessly enhances
                    everyday life, making global communication and collaboration
                    effortless.
                  </Typography>
                </StyledPaper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Meet the Team
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                {teamMembers.map((member, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <StyledPaper sx={{ textAlign: "center", py: 3 }}>
                      <Avatar
                        alt={member.name}
                        sx={{
                          width: 100,
                          height: 100,
                          margin: "0 auto",
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6">{member.name}</Typography>
                      <Typography variant="subtitle2" color="primary">
                        {member.role}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {member.bio}
                      </Typography>
                    </StyledPaper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Container>
    </DefaultLayout>
  );
};

export default AboutPage;
