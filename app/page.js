'use client';

import React, { useState } from 'react';
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
  List,
  ListItem,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';

export default function WaitlistPage() {
  const [userType, setUserType] = useState(0); // 0: IBA Student, 1: New Admission, 2: Non-IBA Student
  const [email, setEmail] = useState('');
  const [reviews, setReviews] = useState([{ teacher: '', review: '' }]);

  const handleTabChange = (event, newValue) => {
    setUserType(newValue);
    setEmail('');
    setReviews([{ teacher: '', review: '' }]);
  };

  const handleReviewChange = (index, field, value) => {
    const updatedReviews = [...reviews];
    updatedReviews[index][field] = value;
    setReviews(updatedReviews);
  };

  const addReviewBox = () => {
    setReviews([...reviews, { teacher: '', review: '' }]);
  };

  const validateReviews = () => {
    const uniqueTeachers = new Set(reviews.map(r => r.teacher));
    return (
      reviews.length >= 3 &&
      reviews.every(r => r.teacher && r.review) &&
      uniqueTeachers.size === reviews.length
    );
  };

  const handleSubmit = () => {
    if (validateReviews() || userType !== 0) { // 0 is for 'IBA Student'
      console.log('User Type:', userType);
      console.log('Email:', email);
      console.log('Reviews:', reviews);
    } else {
      alert('Please ensure that you have filled all fields, provided at least three reviews, and that no teachers are duplicated.');
    }
  };


  const Submit = ({ onClick }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center', // Optional: centers vertically if needed
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#800000',
            color: '#ffffff',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#ffffff',
              color: '#800000',
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
        // backgroundColor: '#f1f1'
        backgroundImage: `url('/iba-3.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',

      }}
    >
      <Container maxWidth="md" sx={{ marginTop: '20px' }}>
        <Card
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255, 0.2)',
            backdropFilter: 'blur(10px)', // Apply blur effect
          }}>
          <Tabs
            value={userType}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'maroon', // Set the indicator color to maroon
              },
              '& .MuiTab-root': {
                textTransform: 'none', // Prevents the label text from being converted to uppercase
                color: 'white', // Set the text color to maroon for unselected tabs
                '&.Mui-selected': {
                  color: 'maroon', // Set the text color to maroon for the selected tab
                },
              },
            }}
          >
            <Tab label="IBA Student" />
            <Tab label="New Admission" />
            <Tab label="Non-IBA Student" />
          </Tabs>

          <CardContent>
            {userType === 0 && (
              <Card
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  backgroundColor: 'rgba(255,255,255, 0.3)',
                  backdropFilter: 'blur(50px)', // Apply blur effect
                }}>
                <CardContent>
                  <TextField
                    label="Enter your Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ marginBottom: 2 }}
                  />
                  <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                      marginBottom: 2,
                      color: '#1e1e1e' // Review Teacher Text Color
                    }}
                  >
                    Review Teachers:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      marginBottom: 1,
                      color: '#1e1e1e' // Description Color
                    }}>
                    Review at least three teachers to help populate the database.
                  </Typography>
                  <List
                    sx={{
                      listStyleType: 'disc',
                      listStylePosition: 'inside',
                      color: '#1e1e1e', // Review Questions color
                      fontWeight: 400,
                      fontSize: '12px',
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    Here’s what you should cover in your review:
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>Which course you took from the teacher</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>How is the teacher in terms of teaching</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>How is the teacher in terms of workload</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>How is the teacher in terms of grading</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '5px' }}>What grades you received</ListItem>
                  </List>
                  {reviews.map((review, index) => (
                    <Card
                      key={index}
                      sx={{
                        marginBottom: 2,
                        padding: 2,
                        backgroundColor: 'rgba(255,255,255, 0.4)',
                        backdropFilter: 'blur(10px)', // Apply blur effect
                      }}
                    >
                      <FormControl
                        fullWidth
                        sx={{
                          marginBottom: 2,
                          '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'maroon', // Change the outline color to maroon on hover
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'maroon', // Change the outline color to maroon when focused
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'maroon', // Change the label color to maroon when focused
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
                            borderColor: 'maroon', // Change the outline color to maroon on hover
                          },
                          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'maroon', // Change the outline color to maroon when focused
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'maroon', // Change the label color to maroon when focused
                          },
                        }}
                      />
                    </Card>
                  ))}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center', // Optional: centers vertically if needed
                    }}
                  >
                    <IconButton onClick={addReviewBox} sx={{ marginBottom: 2 }}>

                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Submit onClick={handleSubmit} />
                </CardContent>
              </Card>
            )}

            {userType === 1 && (
              <Card
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  backgroundColor: 'rgba(255,255,255, 0.3)',
                  backdropFilter: 'blur(10px)', // Apply blur effect
                }}>
                <CardContent>
                  <TextField
                    label="Enter your Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      fontSize: '15px'

                    }}
                  >
                    <ListItem sx={{ display: 'list-item', }}> Gain insights from experienced students</ListItem>
                    <ListItem sx={{ display: 'list-item', }}> Make informed decisions about your course selections</ListItem>
                    <ListItem sx={{ display: 'list-item', }}> Contribute your own experiences to help future students</ListItem>
                  </List>
                  <Submit onClick={handleSubmit} />

                </CardContent>
              </Card>
            )}

            {userType === 2 && (
              <Card
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  backgroundColor: 'rgba(255,255,255, 0.3)',
                  backdropFilter: 'blur(10px)', // Apply blur effect
                }}>
                <CardContent>
                  <TextField
                    label="Enter your Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ marginBottom: 2 }}
                  />
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    About Our Expansion
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    We are excited to announce that we are planning to expand our platform to other universities soon. Stay tuned and join our waitlist to be notified when we launch in your university.
                  </Typography>
                  <Submit onClick={handleSubmit} />
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </Container >
    </Box >
  );
}
