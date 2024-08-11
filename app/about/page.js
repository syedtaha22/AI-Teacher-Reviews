// Import necessary modules and components from MUI and React
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';

// AboutPage Component
const AboutPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative', // Position relative to enable positioning of the background image
        textAlign: 'center',
        padding: '20px',
      }}
    >
      {/* Background image */}
      <Box
        sx={{
          position: 'absolute', // Position absolute to fill the container
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1, // Send background behind content
          overflow: 'hidden', // Hide overflow for background image
        }}
      >
        <Image
          src="/iba6.jpg" // Path to your custom background image
          alt="Background"
          layout="fill" // Make the image fill the container
          objectFit="cover" // Ensure the image covers the container without distortion
          quality={100} // Use the highest quality
          priority // Load image with high priority
        />
      </Box>

      {/* Main content card */}
      <Box
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black for the card background
          borderRadius: 8, // Rounded corners
          p: { xs: 3, sm: 5, md: 7 }, // Padding for different screen sizes
          maxWidth: '800px', // Maximum width of the card
          width: '100%', // Full width for responsiveness
          mx: 'auto', // Center the card horizontally
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)', // Add shadow for a lifted effect
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            gutterBottom
            style={{
              marginBottom: '40px',
              color: 'white',
              backgroundColor: '#700f1a',
              fontFamily: 'Times New Roman',
              borderRadius: '20px',
              padding: '10px', // Added padding for better appearance
            }}
          >
             Teachers Review by AI
          </Typography>

          {/* What We Offer Section */}
          <Box mb={4}>
            <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
              What We Offer
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: 'white' }}>
              We provide students with AI-powered teacher reviews. This
              system enables students to gain insights into any IBA teacher,
              helping them make informed decisions about  choosing educators that align with their learning
              preferences.
            </Typography>
          </Box>

          {/* Our Mission Section */}
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
              Our Mission
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: 'white' }}>
              Our mission is to expand this AI-powered review system beyond IBA,
              offering this service to other universities. By doing so, we aim
              to enhance the educational experience for students everywhere,
              helping them make better-informed decisions about their academic
              paths.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
