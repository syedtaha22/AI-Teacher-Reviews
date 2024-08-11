'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Image from 'next/image';

export default function WaitlistPage() {
  // State to keep track of the selected user type.
  // 0: IBA Student, 1: New Admission, 2: Non-IBA Student
  const [userType, setUserType] = useState(0);

  // State to store the email address entered by the user.
  const [email, setEmail] = useState('');

  // State to manage the list of review boxes for IBA Students.
  // Each review box has a teacher and review field.
  const [reviews, setReviews] = useState([{ teacher: '', review: '' }, { teacher: '', review: '' }, { teacher: '', review: '' }]);

  // Effect hook to reset the reviews when the user type changes.
  useEffect(() => {
    if (userType === 0) {
      // For IBA Students, initialize with three empty review boxes.
      setReviews([{ teacher: '', review: '' }, { teacher: '', review: '' }, { teacher: '', review: '' }]);
    }
  }, [userType]);

  // Handler function to update the selected user type and reset the state accordingly.
  const handleTabChange = (event, newValue) => {
    setUserType(newValue); // Update the selected user type.
    setEmail(''); // Clear the email input field.
    if (newValue === 0) {
      // If IBA Student is selected, initialize review boxes.
      setReviews([{ teacher: '', review: '' }, { teacher: '', review: '' }, { teacher: '', review: '' }]);
    } else {
      // For other user types, clear review boxes.
      setReviews([]);
    }
  };

  // Handler function to update the review details for a specific review box.
  const handleReviewChange = (index, field, value) => {
    const updatedReviews = [...reviews];
    updatedReviews[index][field] = value; // Update the specified field of the review at the given index.
    setReviews(updatedReviews);
  };

  // Function to add a new review box to the list.
  const addReviewBox = () => {
    setReviews([...reviews, { teacher: '', review: '' }]);
  };

  // Function to remove a review box from the list.
  const removeReviewBox = (index) => {
    const updatedReviews = reviews.filter((_, i) => i !== index); // Remove the review box at the specified index.
    setReviews(updatedReviews);
  };

  // Function to validate the review entries.
  // Ensures at least three reviews are provided, all fields are filled, and no duplicate teachers.
  const validateReviews = () => {
    const uniqueTeachers = new Set(reviews.map(r => r.teacher)); // Extract unique teacher names from reviews.
    return (
      reviews.length >= 3 && // Check if there are at least three reviews.
      reviews.every(r => r.teacher && r.review) && // Check if all review fields are filled.
      uniqueTeachers.size === reviews.length // Check if there are no duplicate teacher names.
    );
  };

  // Handler function for form submission.
  const handleSubmit = () => {
    if (validateReviews() || userType !== 0) { // Validate reviews if user type is IBA Student.
      console.log('User Type:', userType); // Log the user type.
      console.log('Email:', email); // Log the email address.
      console.log('Reviews:', reviews); // Log the review details.
    } else {
      alert('Please ensure that you have filled all fields, provided at least three reviews, and that no teachers are duplicated.');
    }
  };

  // Component for the submit button with custom styling.
  const Submit = ({ onClick }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#800000', // Maroon background color.
            color: '#ffffff', // White text color.
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#ffffff', // Inverted background color on hover.
              color: '#800000', // Inverted text color on hover.
            },
          }}
          onClick={onClick}
        >
          Submit and Join Waitlist
        </Button>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        padding: '20px',
        backgroundImage: `url('/blured-bg.jpg')`, // Background image for the page.
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="md" sx={{ marginTop: '20px' }}>
        <Card
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255, 0.2)', // Semi-transparent card background.
            backdropFilter: 'blur(10px)', // Blurred effect for the card.
          }}
        >
          <Tabs
            value={userType}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'maroon', // Maroon color for the tab indicator.
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                color: 'white', // White text color for tabs.
                '&.Mui-selected': {
                  color: 'maroon', // Maroon color for the selected tab.
                },
              },
            }}
          >
            <Tab label="IBA Student" /> {/* Tab for IBA Student */}
            <Tab label="New Admission" /> {/* Tab for New Admission */}
            <Tab label="Non-IBA Student" /> {/* Tab for Non-IBA Student */}
          </Tabs>

          <CardContent
            sx={{
              marginBottom: -2 // Adjust bottom margin for CardContent.
            }}
          >
            {/* Conditionally render content based on the selected user type */}
            {userType === 0 && (
              <Card
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  backgroundColor: 'rgba(255,255,255, 0.3)', // Semi-transparent background for the card.
                  backdropFilter: 'blur(50px)', // Blurred effect for the card.
                }}
              >
                <CardContent>
                  <TextField
                    label="Enter your Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email state on input change.
                    sx={{ marginBottom: 2 }}
                  />
                  <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                      marginBottom: 2,
                      color: '#1e1e1e', // Dark text color.
                    }}
                  >
                    Review Teachers:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      marginBottom: 1,
                      color: '#1e1e1e', // Dark text color.
                    }}
                  >
                    Review at least three teachers to help populate the database.
                  </Typography>
                  <List
                    sx={{
                      listStyleType: 'disc',
                      listStylePosition: 'inside',
                      color: '#1e1e1e', // Dark text color for list items.
                      fontWeight: 400,
                      fontSize: '10px', // Small font size for list items.
                      padding: 0,
                      margin: 0,
                      marginBottom: 2
                    }}
                  >
                    Here's what you should cover in your review:
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>Which course you took from the teacher</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>How is the teacher in terms of teaching</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>How is the teacher in terms of workload</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>How is the teacher in terms of grading</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '5px' }}>What grades you received</ListItem>
                    Remmber, The more detailed the review, the better the AI can help you find your teacher!!
                  </List>

                  <Grid container spacing={2}>
                    {reviews.map((review, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card
                          sx={{
                            padding: 2,
                            backgroundColor: 'rgba(255,255,255, 0.4)', // Slightly transparent card background.
                            backdropFilter: 'blur(10px)', // Blurred effect for the card.
                          }}
                        >
                          <FormControl
                            fullWidth
                            sx={{
                              marginBottom: 2,
                              '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'maroon', // Maroon border color on hover.
                              },
                              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'maroon', // Maroon border color when focused.
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: 'maroon', // Maroon color for the label when focused.
                              },
                            }}
                          >
                            <InputLabel>Teacher</InputLabel>
                            <Select
                              value={review.teacher}
                              onChange={(e) => handleReviewChange(index, 'teacher', e.target.value)}
                            >
                              <MenuItem value="Teacher A">Teacher A</MenuItem>
                              <MenuItem value="Teacher B">Teacher B</MenuItem>
                              <MenuItem value="Teacher C">Teacher C</MenuItem>
                              <MenuItem value="Teacher D">Teacher D</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            label="Review"
                            variant="outlined"
                            fullWidth
                            multiline
                            value={review.review}
                            onChange={(e) => handleReviewChange(index, 'review', e.target.value)}
                            sx={{
                              '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'maroon', // Maroon border color on hover.
                              },
                              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'maroon', // Maroon border color when focused.
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: 'maroon', // Maroon color for the label when focused.
                              },
                            }}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Buttons to add or remove review boxes */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 2,
                    }}
                  >
                    <IconButton onClick={addReviewBox} sx={{ marginRight: 1 }}>
                      <AddIcon /> {/* Icon to add a review box */}
                    </IconButton>
                    <IconButton
                      onClick={() => removeReviewBox(reviews.length - 1)}
                      sx={{ marginLeft: 1 }}
                      disabled={reviews.length <= 3} // Disable button if there are 3 or fewer review boxes.
                    >
                      <RemoveIcon /> {/* Icon to remove a review box */}
                    </IconButton>
                  </Box>

                  {/* Submit button */}
                  <Submit onClick={handleSubmit} />
                </CardContent>
              </Card>
            )}

            {userType === 1 && (
              <Card
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  backgroundColor: 'rgba(255,255,255, 0.3)', // Semi-transparent background for the card.
                  backdropFilter: 'blur(10px)', // Blurred effect for the card.
                }}>
                <CardContent>
                  <TextField
                    label="Enter your Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email state on input change.
                    sx={{ marginBottom: 2 }}
                  />
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Welcome to IBA!
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Our platform provides insights into the teaching methods, grading policies, and overall experiences with IBA instructors. As a new student, you’ll benefit from honest reviews that can help you choose your courses wisely.
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 0 }}>
                    Benefits:
                  </Typography>
                  <List
                    sx={{
                      listStyleType: 'disc',
                      listStylePosition: 'inside',
                      fontWeight: 400,
                      fontSize: '15px' // Adjust font size for list items.
                    }}
                  >
                    <ListItem sx={{ display: 'list-item', }}> Gain insights from experienced students</ListItem>
                    <ListItem sx={{ display: 'list-item', }}> Make informed decisions about your course selections</ListItem>
                    <ListItem sx={{ display: 'list-item', }}> Contribute your own experiences to help future students</ListItem>
                  </List>
                  {/* Submit button */}
                  <Submit onClick={handleSubmit} />
                </CardContent>
              </Card>
            )}
            {userType === 2 && (
              <Card
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  backgroundColor: 'rgba(255,255,255, 0.3)', // Semi-transparent background for the card.
                  backdropFilter: 'blur(10px)', // Blurred effect for the card.
                }}>
                <CardContent>
                  <TextField
                    label="Enter your Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email state on input change.
                    sx={{ marginBottom: 2 }}
                  />
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    About Our Expansion
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    We are excited to announce that we are planning to expand our platform to other universities soon. Stay tuned and join our waitlist to be notified when we launch in your university.
                  </Typography>
                  {/* Submit button */}
                  <Submit onClick={handleSubmit} />
                </CardContent>
              </Card>
            )}

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
