'use client';

import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Rating,
    Card,
    CardContent,
    IconButton,
    AppBar,
    Link,
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { ArrowBackIos } from "@mui/icons-material";

const FeedbackPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const feedbackData = { name, email, rating, comments };

        try {
            const response = await fetch('/api/send-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
            });

            if (response.ok) {
                setStatus("Feedback sent successfully!");
            } else {
                setStatus("Error sending feedback.");
            }
        } catch (error) {
            setStatus("Error sending feedback.");
        }

        setName("");
        setEmail("");
        setRating(0);
        setComments("");
    };

    return (
        <div
            style={{
                backgroundImage: "url('/reviewpage-blurred.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
            }}
        >

            <Container maxWidth="sm">
                <Box display="flex" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" mb={0}>
                        <Link
                            href="/review-page"
                            underline="none"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#fff',
                                '&:hover': {
                                    color: '#800000', // Changes color on hover
                                },
                                fontWeight: 'bold',
                            }}
                        >
                            <ArrowBackIos />
                            Back
                        </Link>
                    </Box>
                </Box>
                <Card
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <CardContent>
                        <Typography variant="h4" gutterBottom align="center" sx={{ color: '#700000' }}>
                            Feedback
                        </Typography>
                        <Typography variant="body1" align="center" color="textSecondary">
                            We value your input and appreciate your time. Please share your feedback below!
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Name"
                                fullWidth
                                margin="normal"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                sx={{
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
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{
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
                            <Box display="flex" alignItems="center" marginY={2}>
                                <Typography component="legend" marginRight={1}>
                                    Rating:
                                </Typography>
                                <Rating
                                    name="rating"
                                    value={rating}
                                    onChange={(e, newValue) => setRating(newValue)}
                                    precision={0.5}
                                    size="medium"
                                    sx={{
                                        color: "#800000",
                                    }}
                                />
                            </Box>
                            <TextField
                                label="Comments"
                                multiline
                                rows={4}
                                fullWidth
                                margin="normal"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                required
                                sx={{
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
                            {/* Centering the button */}
                            <Box
                                display="flex"
                                flexDirection='column'
                                justifyContent="center"
                                alignItems='center'
                                marginY={2}
                                marginBottom='0px'>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#800000', // Maroon background color
                                        color: '#ffffff', // White text color
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#ffffff', // Inverted background color on hover
                                            color: '#800000', // Inverted text color on hover
                                        },
                                    }}
                                >
                                    Submit Feedback
                                </Button>
                                {status && <Typography mt={2} color='maroon'>{status}</Typography>}
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </div >
    );
};

export default FeedbackPage;
