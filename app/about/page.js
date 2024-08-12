'use client';

// Import necessary modules and components from MUI and React
import React from 'react';
import { Container, Typography, Box, IconButton, Button } from '@mui/material';
import Image from 'next/image';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// AboutPage Component
const AboutPage = () => {

  const router = useRouter(); // Initialize the router

  const handleBack = () => {
    router.push('/');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
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
          src="/bg.jpg" // Path to your custom background image
          alt="Background"
          layout="fill" // Make the image fill the container
          objectFit="cover" // Ensure the image covers the container without distortion
          quality={100} // Use the highest quality
          priority // Load image with high priority
          style={{
            filter: 'blur(10px)',
            transform: 'scale(2.05)', // Slightly increase the image size to prevent vignette
          }} // Apply blur effect to the image
        />
      </Box>

      <IconButton
        onClick={handleBack} // Navigate to home page
        sx={{
          position: 'absolute', // Position the button absolutely within the viewport
          top: 20,
          left: 30,
          color: 'white',
          '&:hover': {
            color: 'maroon',
          },
        }}
      >
        <ArrowBack />
      </IconButton>

      {/* Main content card */}
      <Box
        sx={{
          marginTop: '60px',
          marginBottom: '5px',
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
            variant="h4" // Changed from h3 to h4 for smaller heading
            gutterBottom
            style={{
              marginBottom: '20px', // Reduced margin for better spacing
              color: 'white',
              backgroundColor: '#700f1a',
              borderRadius: '20px',
              padding: '10px', // Added padding for better appearance
            }}
          >
            FacultyInsight
          </Typography>

          {/* What We Offer Section */}
          <Box mb={4}>
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              What We Offer
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: 'white' }}>
              We provide students with AI-powered teacher reviews. This
              system enables students to gain insights into any IBA teacher,
              helping them make informed decisions about choosing educators that align with their learning
              preferences.
            </Typography>
          </Box>

          {/* Our Mission Section */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              Our Mission
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: 'white' }}>
              Our mission is to expand this AI-powered review system beyond IBA,
              offering this service to other universities. By doing so, we aim
              to enhance the educational experience for students everywhere,
              helping them make better-informed decisions about their academic
              paths.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer section */}
      <Box

        sx={{
          bgcolor: 'tranparent',
          py: 2,
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <Container>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              href="https://syedtaha.org"
              target="_blank"
              sx={{
                color: '#ffffff',
                textTransform: 'none',
                mx: 1,
                fontSize: '8px',
              }}
            >
              Syed Taha
            </Button>

            {/* Dot separator */}
            <Typography sx={{ color: '#ffffff', mx: 1 }}>•</Typography>

            <Button
              href="https://ammar-khan18.github.io/Portfolio-Website/"
              target="_blank"
              sx={{
                color: '#ffffff',
                textTransform: 'none',
                mx: 1,
                fontSize: '8px',
              }}
            >
              Ammar Khan
            </Button>

            {/* Dot separator */}
            <Typography sx={{ color: '#ffffff', mx: 1 }}>•</Typography>

            <Button
              href="https://rh29152.github.io/Landing-page/"
              target="_blank"
              sx={{
                color: '#ffffff',
                textTransform: 'none',
                mx: 1,
                fontSize: '8px',
              }}
            >
              Rashid Hussain
            </Button>
          </Box>
        </Container>
      </Box>


    </Box>
  );
};

export default AboutPage;
