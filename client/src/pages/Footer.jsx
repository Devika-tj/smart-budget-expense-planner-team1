import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      id="about-section"
      component="footer"
      sx={{
        backgroundColor: 'white',
        color: '#333',
        py: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 6, md: 10 },
        mt: 'auto',
        borderTop: '1px solid #ddd',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Grid
        container
        spacing={{ xs: 4, sm: 6, md: 10 }}
        justifyContent="center"
        alignItems={{ xs: 'center', sm: 'flex-start' }}
        direction={{ xs: 'column', sm: 'row' }}
        textAlign={{ xs: 'center', sm: 'left' }}
      >
        
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" gutterBottom>
            <b>About</b>
          </Typography>
          <Typography variant="body2">
            PiggyTrack helps you manage your expenses smartly.
          </Typography>
          <Typography>
            Track spending, set budgets, and save more — all in one place.
          </Typography>
        </Grid>

        
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" gutterBottom>
            <b>Contact</b>
          </Typography>
          <Typography variant="body2">Email: support@piggytrack.com</Typography>
          <Typography variant="body2">Phone: +91 98765 43210</Typography>
        </Grid>
      </Grid>

      <Box textAlign="center" sx={{ mt: 4 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
        >
          © {new Date().getFullYear()} PiggyTrack. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
