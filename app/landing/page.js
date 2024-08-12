'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Link } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import { firestore } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';

const themeColors = {
  background: '#FAF9F6',
  foreground: '#FAF9F6',
  primary: '#800000',
  primaryForeground: '#FAF9F6',
  muted: '#404040',
};

const LandingPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useMediaQuery('(max-width:600px)');
  const router = useRouter();

  const handleWaitlist = () => {
    router.push('/waitlist');
  };

  const handleAbout = () => {
    router.push('/about');
  };

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const waitlists = collection(firestore, 'waitlist');
        const querySnapshot = await getDocs(waitlists);

        let userCount = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.emails) {
            userCount += data.emails.length;
          }
        });

        setTotalUsers(userCount);
      } catch (error) {
        console.error('Error fetching review count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'transparent',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Image
          src={isMobile ? "/iba-mobile.jpg" : "/iba.jpg"}
          alt="Hero"
          fill // Replaces layout="fill"
          quality={100}
          priority
          style={{
            filter: 'blur(10px)',
            transform: 'scale(2.05)',
            objectFit: 'cover', // Replaces objectFit="cover"
          }}
        />
      </Box>


      <Box
        component="header"
        sx={{
          px: { xs: 2, lg: 4 },
          height: 56,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'transparent',
          position: 'relative',
          zIndex: 1,
          justifyContent: 'space-between',
        }}
      >
        <Button
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textTransform: 'none',
            color: themeColors.foreground,
            fontFamily: 'Manrope, sans-serif',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            FacultyInsight
          </Typography>
        </Button>

        <Box
          component="nav"
          sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}
        >
          <Button
            onClick={handleAbout}
            sx={{
              textTransform: 'none',
              color: themeColors.foreground,
            }}
          >
            About
          </Button>
        </Box>
      </Box >

      < Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          px: { xs: 2, sm: 4 },
          pt: { xs: 8, sm: 10 },
          pb: { xs: 4, sm: 6 },
        }}
      >
        < Box
          sx={{
            position: 'relative',
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 2,
            p: { xs: 2, sm: 4, md: 6 },
            maxWidth: '600px',
            mx: 'auto',
            zIndex: 1,
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          < Typography
            variant="h4"
            sx={{
              color: themeColors.foreground,
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2rem', lg: '2.5rem' },
              lineHeight: 1.2,
            }}
          >
            Discover the Best IBA Teachers with AI-Powered Reviews
          </Typography >

          < Typography
            variant="body1"
            sx={{
              color: themeColors.foreground,
              fontFamily: 'Manrope, sans-serif',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              mt: 2,
            }}
          >
            Our AI-driven platform provides personalized teacher recommendations and in-depth reviews to help
            IBA students find the perfect educator.
          </Typography >

          < Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleWaitlist}
              sx={{
                borderRadius: '50px',
                backgroundColor: themeColors.primary,
                color: themeColors.primaryForeground,
                '&:hover': {
                  backgroundColor: themeColors.background,
                  color: themeColors.primary
                },
                py: 1.5,
                px: 3,
                textTransform: 'none'
              }}
            >
              Join Waitlist
            </Button>
            <Typography
              variant='h6'
              sx={{
                marginTop: '15px',
                color: 'white',
              }}
            >
              {isLoading ? 'Calculating...' : `${totalUsers} People Have Joined the Waitlist`}
            </Typography>
          </Box >
        </Box >
      </Box >


    </Box >
  );
}

export default LandingPage;
