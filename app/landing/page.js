'use client';

// Import necessary components and hooks from Material UI and Next.js
import { Box, Button, Typography, Link } from '@mui/material';
import Image from 'next/image';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';

// Define a theme color palette for consistent styling
const themeColors = {
  background: '#FAF9F6', // Background color
  foreground: '#FAF9F6', // Foreground color for text
  primary: '#800000', // Primary color for buttons
  primaryForeground: '#FAF9F6', // Color for text on primary button
  muted: '#404040', // Muted color for secondary elements
};

// Main Page component
const LandingPage = () => {
  // Use media query to determine if the viewport width is 600px or less (mobile devices)
  const isMobile = useMediaQuery('(max-width:600px)');
  const router = useRouter()

  const handleWaitlist = () => {
    router.push('/waitlist-front');
  };


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'transparent', // Set background color to transparent
        overflow: 'hidden', // Hide any overflow
        position: 'relative', // Position element relative to its normal position
      }}
    >
      {/* Container for background image */}
      <Box
        sx={{
          position: 'absolute', // Position absolutely to fill the container
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden', // Hide overflow for background image
        }}
      >
        <Image
          src={isMobile ? "/iba-mobile.jpg" : "/iba.jpg"} // Conditionally set image source based on viewport width
          alt="Hero" // Alternative text for the image
          layout="fill" // Make the image fill the container
          objectFit="cover" // Ensure the image covers the container without distortion
          quality={100} // Use highest quality
          priority // Load image with high priority
          style={{
            filter: 'blur(10px)',
            transform: 'scale(1.05)' // Slightly increase the image size to prevent vignette

          }} // Apply blur effect to the image
        />
      </Box>
      {/* Header section */}
      <Box
        component="header"
        sx={{
          px: { xs: 2, lg: 4 }, // Padding for different screen sizes
          height: 56, // Fixed height for header
          display: 'flex',
          alignItems: 'center', // Center items vertically
          backgroundColor: 'transparent', // Transparent background for header
          position: 'relative',
          zIndex: 1, // Ensure header is above other content
          justifyContent: 'space-between', // Space out header items
        }}
      >
        {/* Header title */}
        <Link
          href="#"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none', // Remove underline from link
            color: themeColors.foreground, // Set text color
            fontFamily: 'Manrope, sans-serif', // Font family for text
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            AI-Instructor Review
          </Typography>
        </Link>
        {/* Navigation links */}
        <Box
          component="nav"
          sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }} // Set gap between navigation links
        >
          <Link
            href="#"
            sx={{
              textDecoration: 'none', // Remove underline from link
              color: themeColors.foreground, // Set text color
              fontFamily: 'Manrope, sans-serif', // Font family for text
              fontWeight: 500, // Font weight for navigation links
              fontSize: '0.875rem', // Font size for navigation links
            }}
          >
            About
          </Link>
        </Box>
      </Box>
      {/* Main content section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center', // Center content vertically
          justifyContent: 'center', // Center content horizontally
          position: 'relative',
          overflow: 'hidden', // Hide overflow for main content
          px: { xs: 2, sm: 4 }, // Padding for different screen sizes
          pt: { xs: 8, sm: 10 }, // Padding-top for different screen sizes
          pb: { xs: 4, sm: 6 }, // Padding-bottom for different screen sizes
        }}
      >
        {/* Content container */}
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background color
            borderRadius: 2, // Rounded corners
            p: { xs: 2, sm: 4, md: 6 }, // Padding for different screen sizes
            maxWidth: '600px', // Maximum width of content container
            mx: 'auto', // Center container horizontally
            zIndex: 1, // Ensure container is above other content
            textAlign: 'center', // Center text inside container
            width: '100%', // Full width of container
            boxSizing: 'border-box', // Include padding and border in element's total width and height
          }}
        >
          {/* Main heading */}
          <Typography
            variant="h4"
            sx={{
              color: themeColors.foreground, // Set text color
              fontFamily: 'Manrope, sans-serif', // Font family for text
              fontWeight: 700, // Font weight for heading
              fontSize: { xs: '1.5rem', sm: '2rem', lg: '2.5rem' }, // Font size for different screen sizes
              lineHeight: 1.2, // Line height for heading
            }}
          >
            Discover the Best IBA Teachers with AI-Powered Reviews
          </Typography>
          {/* Subheading */}
          <Typography
            variant="body1"
            sx={{
              color: themeColors.foreground, // Set text color
              fontFamily: 'Manrope, sans-serif', // Font family for text
              fontSize: { xs: '1rem', sm: '1.25rem' }, // Font size for different screen sizes
              mt: 2, // Margin-top for spacing
            }}
          >
            Our AI-driven platform provides personalized teacher recommendations and in-depth reviews to help
            IBA students find the perfect educator.
          </Typography>
          {/* Button */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleWaitlist()}
              sx={{
                borderRadius: '50px',
                backgroundColor: themeColors.primary, // Background color for button
                color: themeColors.primaryForeground, // Text color for button
                '&:hover': {
                  backgroundColor: themeColors.background, // Change background color on hover
                  color: themeColors.primary // Change text color on hover
                },
                py: 1.5, // Padding-top and padding-bottom for button
                px: 3, // Padding-left and padding-right for button
                textTransform: 'none' // Prevent text transformation
              }}
            >
              Join Waitlist
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LandingPage;