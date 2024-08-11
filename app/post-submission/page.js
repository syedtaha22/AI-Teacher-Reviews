'use client';

// Import necessary modules and components from MUI and React
import { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';

// ThankYouPage Component
const ThankYouPage = () => {
	const [totalReviews, setTotalReviews] = useState(0);
	const [isLoading, setIsLoading] = useState(true); // New loading state

	useEffect(() => {
		const fetchReviewCount = async () => {
			try {
				const teachersCollection = collection(firestore, 'teachers');
				const querySnapshot = await getDocs(teachersCollection);

				let reviewCount = 0;

				querySnapshot.forEach((doc) => {
					const data = doc.data();
					if (data.reviews) {
						reviewCount += data.reviews.length;
					}
				});

				setTotalReviews(reviewCount);
			} catch (error) {
				console.error('Error fetching review count:', error);
			} finally {
				setIsLoading(false); // Stop loading once data is fetched
			}
		};

		fetchReviewCount();
	}, []);

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				textAlign: 'center',
				padding: '20px',
				overflow: 'hidden',
				flexDirection: 'column',
				gap: '20px',
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					zIndex: -1,
				}}
			>
				<Image
					src="/bg.jpg"
					alt="Background"
					fill
					style={{
						objectFit: 'cover',
						filter: 'blur(15px)',
						transform: 'scale(2.05)',
					}}
					quality={100}
					priority
				/>
			</Box>

			<Box
				sx={{
					bgcolor: 'rgba(255,255,255,0.4)',

					borderRadius: 2,
					p: { xs: 3, sm: 5, md: 7 },
					maxWidth: '600px',
					width: '100%',
					mx: 'auto',
					boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.5)',
				}}
			>
				<Container maxWidth="md">
					<Typography
						variant="h4"
						gutterBottom
						sx={{ color: 'blac', mb: 2 }}
					>
						Thank You for Joining the Waitlist!
					</Typography>
					<Typography
						variant="body1"
						sx={{
							color: 'black'
						}}
					>
						We appreciate your interest in our platform. You will be notified as soon as we are ready to launch. Stay tuned for updates!
					</Typography>
				</Container>

				<Box
					sx={{
						bgcolor: 'rgba(255, 255, 255, 0.2)',
						borderRadius: 2,
						p: { xs: 2, sm: 4 },
						maxWidth: '400px',
						width: '100%',
						mx: 'auto',
						color: 'white',
						marginTop: '20px'
						// boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.5)',
					}}
				>
					<Typography
						variant="h6"
						gutterBottom
						sx={{
							marginBottom: '10px',
							color: 'black'
						}}
					>
						Total Reviews Received so far:
					</Typography>
					<Typography
						variant="h3"
						sx={{
							fontWeight: 'bold',
							color: '#700000'
						}}
					>
						{isLoading ? 'Calculating...' : `${totalReviews} Reviews`}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default ThankYouPage;
