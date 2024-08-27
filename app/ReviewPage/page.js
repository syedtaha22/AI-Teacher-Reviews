'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Box, Typography, Container, CircularProgress as MUIProgress, AppBar, Button, Link } from '@mui/material';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import Image from 'next/image';

// CircularProgressWithLabel component definition
const CircularProgressWithLabel = (props) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            {/* Background Circle */}
            <MUIProgress
                variant="determinate"
                value={100}
                sx={{
                    color: 'rgba(80,0,0,0.2)', // Incomplete part color (blue)
                    position: 'absolute',
                }}
                size={props.size}
                thickness={props.thickness}
            />
            {/* Foreground Circle */}
            <MUIProgress
                variant="determinate"
                {...props}
                sx={{
                    color: '#800000', // Complete part color (maroon)
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round', // Adds round ends to the progress indicator
                    },
                }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
};

// ScoreChart component definition
const ScoreChart = ({ score, maxScore, label }) => {
    const percentage = (score / maxScore) * 100;

    return (
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: 1 }}>
            <CircularProgressWithLabel value={percentage} size={60} thickness={4} sx={{ marginBottom: 1 }} />
            <Typography variant="caption">{label}</Typography>
        </Box>
    );
};

// ReviewBox component definition
const ReviewBox = ({ review, reviewCount, loading }) => {
    if (loading) {
        return <MUIProgress
            sx={{
                alignSelf: 'center',
                color: '#800000', // Complete part color (maroon)
                '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round', // Adds round ends to the progress indicator
                },
            }}
        />;
    }

    if (!review || typeof review !== 'object') {
        return (
            <Box
                sx={{
                    padding: 2,
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    marginTop: 2
                }}>
                <Typography variant="h6">Teacher Review</Typography>
                <Typography variant="body1">Select a teacher to see the review.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', marginTop: 2 }}>
            <Typography variant="h6">{review[0].TeacherName}</Typography>
            <Typography fontSize="12px" sx={{ marginBottom: 1 }}>Number of Reviews: {reviewCount}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                <ScoreChart score={review[0].leniency} maxScore={10} label="Leniency" />
                <ScoreChart score={review[0].workload} maxScore={10} label="Workload" />
                <ScoreChart score={review[0].difficulty} maxScore={10} label="Difficulty" />
                <ScoreChart score={review[0].grading} maxScore={10} label="Grading" />
                <ScoreChart score={review[0].learning} maxScore={10} label="Learning" />
                <ScoreChart score={review[0].overall} maxScore={10} label="Overall" />
            </Box>
            <Typography variant="body1" sx={{ marginTop: 2, color: '#800000' }}><strong>Summary:</strong> </Typography>
            <Typography>{review[0].summary}</Typography>
        </Box>
    );
};

// ReviewPage component definition
const ReviewPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [reviewCount, setReviewCount] = useState(0); // New state variable for review count

    useEffect(() => {
        fetch("/teachers.json")
            .then((response) => response.json())
            .then((data) => setTeachers(data));
    }, []);

    const fetchReview = async (teacherName) => {
        if (!teacherName) return;
        setLoading(true);
        const teacherKey = teacherName.replace(/[.\s]/g, "").toLowerCase();

        try {
            const coursesResponse = await fetch("/teachers_courses.json");
            const coursesData = await coursesResponse.json();
            const teacherCourses = coursesData[teacherKey]?.courses_taught || [];

            const teacherRef = doc(firestore, "teachers", teacherKey);
            const teacherDoc = await getDoc(teacherRef);
            const reviews = teacherDoc.exists() ? teacherDoc.data().reviews || [] : [];

            setReviewCount(reviews.length); // Set the review count

            const postData = {
                teacher: teacherName,
                reviews: reviews,
                courses_taught: teacherCourses,
            };

            const response = await fetch('/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const aiReview = await response.json();
            setReview(aiReview);
        } catch (error) {
            console.error('Error:', error);
            setReview("Error retrieving the review. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleTeacherChange = (event, value) => {
        setSelectedTeacher(value);
        fetchReview(value);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                backgroundImage: `url('/reviewpage-blurred.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >

            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: 'transparent', // Adds a slight background color for visibility
                    // backdropFilter: 'blur(10px)', // Adds a backdrop blur effect for a frosted glass look
                    alignItems: 'center',
                    padding: '10px 20px', // Adds padding for better spacing
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}
            >
                <Typography
                    sx={{
                        color: '#800000',
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px', // Adjust the thickness as needed
                    }}
                >
                    This is a Beta
                </Typography>
                <Link
                    href="/feedback"
                    underline="none"
                    sx={{
                        color: '#fff',
                        '&:hover': {
                            color: '#800000', // Changes color on hover
                        },
                        fontWeight: 'bold',
                    }}
                >
                    Feedback
                </Link>
            </AppBar>

            <Box
                sx={{
                    position: 'relative',
                    minHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: { xs: '90%', sm: '80%', md: '60%', lg: '50%' }, // Adjusts width based on screen size
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        padding: 2,
                        borderRadius: '8px',
                        boxShadow: 3, // Adds a subtle shadow for depth
                        marginTop: 4,
                    }}
                >
                    <Autocomplete
                        options={teachers}
                        value={selectedTeacher}
                        onChange={handleTeacherChange}
                        renderInput={(params) => (
                            <TextField {...params}
                                label="Select or Search for a Teacher"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    marginBottom: 2,
                                    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'maroon',
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'maroon',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'maroon',
                                    },
                                }}
                            />
                        )}
                    />
                    <ReviewBox review={review} reviewCount={reviewCount} loading={loading} />
                </Container>
            </Box>
        </Box>
    );
};

export default ReviewPage;
