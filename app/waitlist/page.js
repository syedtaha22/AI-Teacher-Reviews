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
  ListItem,
  Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { firestore } from '@/firebase';
import { useRouter } from 'next/navigation';

// Component for the submit button with custom styling.
const Submit = ({ onClick, isSubmitting }) => {
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
        {isSubmitting ? 'Submitting...' : 'Submit and Join Waitlist'}
      </Button>
    </Box>
  );
};

const WaitlistPage = () => {
  // State to keep track of the selected user type.
  // 0: IBA Student, 1: New Admission, 2: Non-IBA Student
  const [userType, setUserType] = useState(0);

  // State to store the email address entered by the user.
  const [email, setEmail] = useState('');

  // State to manage the list of review boxes for IBA Students.
  // Each review box has a teacher and review field.
  const [reviews, setReviews] = useState([{ teacher: '', review: '' }, { teacher: '', review: '' }, { teacher: '', review: '' }]);


  // State to see if form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Effect hook to reset the reviews when the user type changes.
  useEffect(() => {
    if (userType === 0) {
      // For IBA Students, initialize with three empty review boxes.
      setReviews([{ teacher: '', review: '' }, { teacher: '', review: '' }, { teacher: '', review: '' }]);
    }
  }, [userType]);

  // State to manage the error message.
  const [error, setError] = useState('');

  // Router hook to navigate to the waitlist page.
  const router = useRouter()

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
  // Function to validate the form entries.
  // Function to validate the form entries.
  const validateForm = () => {
    if (!email) {
      setError('Please provide a valid email address.');
      return false;
    }

    // Ensure the email is a Gmail address
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      setError('Please provide a Gmail address.');
      return false;
    }

    // Additional validation only for IBA Students (userType === 0)
    if (userType === 0) {
      // Check if any review field is empty
      for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        if (!review.teacher || !review.review) {
          setError(`Please fill in all fields for review ${i + 1}.`);
          return false;
        }
      }

      // Filter reviews with both teacher and review fields filled
      const uniqueReviews = Array.from(
        new Set(
          reviews
            .filter((review) => review.teacher && review.review)
            .map((review) => review.teacher)
        )
      );

      // Ensure there are at least 3 unique reviews
      if (uniqueReviews.length < 3) {
        setError('Please provide unique reviews for at least 3 different teachers.');
        return false;
      }
    }

    // Clear any previous errors
    setError('');
    return true;
  };

  // Handler function for form submission.
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Determine the Firestore document reference based on the user type
      let documentRef;
      if (userType === 0 || userType === 1) {
        documentRef = doc(firestore, 'waitlist', 'iba-students');
      } else if (userType === 2) {
        documentRef = doc(firestore, 'waitlist', 'non-iba');
      }

      // Save the email to the appropriate document
      if (userType !== 0) {
        await setDoc(documentRef,
          {
            emails: arrayUnion(email)
          },
          { merge: true }
        );
      } else if (userType === 0) {
        // Save email and teacher reviews for IBA students
        await setDoc(documentRef,
          {
            emails: arrayUnion(email)
          },
          { merge: true }
        );

        // Save teacher reviews
        for (let review of reviews) {
          const teacherId = review.teacher.replace(/[.\s]/g, '').toLowerCase();
          const teacherRef = doc(firestore, 'teachers', teacherId);

          const teacherDoc = await getDoc(teacherRef);

          if (teacherDoc.exists()) {
            await updateDoc(teacherRef, {
              reviews: arrayUnion(review.review)
            });
          } else {
            await setDoc(teacherRef, {
              reviews: [review.review]
            });
          }
        }
      }

      console.log('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again later.');
    }

    setIsSubmitting(false)
    router.push('/post-submission');

  };

  const [teachersList, setTeachersList] = useState([]);

  useEffect(() => {
    // Fetch the JSON file from the public directory
    fetch('/teachers.json')
      .then(response => response.json())
      .then(data => {
        // Set the teachersList state with the fetched data
        setTeachersList(data);
      })
      .catch(error => {
        console.error('Error fetching teachers list:', error);
      });
  }, []);




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

            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'maroon', // Maroon color for the tab indicator.
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                color: '#000000', // White text color for tabs.
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
                    Here&apos;s what you should cover in your review:
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>Which course you took from the teacher</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>How is the teacher in terms of teaching</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>How is the teacher in terms of workload</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '-15px' }}>How is the teacher in terms of grading</ListItem>
                    <ListItem sx={{ display: 'list-item', marginBottom: '5px' }}>What grades you received</ListItem>
                    Remember, The more detailed the review, the better the AI can help you find your teacher!!
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
                            <Autocomplete
                              options={teachersList} // Dynamically populated options
                              value={review.teacher || null} // Ensure it works even if the teacher is not yet selected
                              onChange={(e, newValue) => handleReviewChange(index, 'teacher', newValue)}
                              filterOptions={(options, { inputValue }) => {
                                const filtered = options.filter((option) =>
                                  option.toLowerCase().includes(inputValue.toLowerCase())
                                );
                                return filtered;
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Teacher"
                                  variant="outlined"
                                  InputLabelProps={{
                                    style: { color: 'maroon' }, // Maroon label color
                                  }}
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: params.InputProps.endAdornment,
                                  }}
                                />
                              )}
                            />
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
                      marginBottom: 1
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

                  {/* Error messages */}
                  {error && (
                    <Grid item xs={12} container justifyContent="center" textAlign="center" marginBottom={2}>
                      <Typography variant="body1" color="error">
                        {error}
                      </Typography>
                    </Grid>
                  )}

                  {/* Submit button */}
                  <Submit onClick={handleSubmit} isSubmitting={isSubmitting} />
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
                  />
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Welcome to IBA!
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Our platform provides insights into the teaching methods, grading policies, and overall experiences with IBA instructors. As a new student, you&apos;ll benefit from honest reviews that can help you choose your courses wisely.
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

                  {/* Error messages */}
                  {error && (
                    <Grid item xs={12} container justifyContent="center" textAlign="center" marginBottom={2}>
                      <Typography variant="body1" color="error">
                        {error}
                      </Typography>
                    </Grid>
                  )}


                  {/* Submit button */}
                  <Submit onClick={handleSubmit} isSubmitting={isSubmitting} />
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
                  />
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    About Our Expansion
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    We are excited to announce that we are planning to expand our platform to other universities soon. Stay tuned and join our waitlist to be notified when we launch in your university.
                  </Typography>

                  {/* Error messages */}
                  {error && (
                    <Grid item xs={12} container justifyContent="center" textAlign="center" marginBottom={2}>
                      <Typography variant="body1" color="error">
                        {error}
                      </Typography>
                    </Grid>
                  )}


                  {/* Submit button */}
                  <Submit onClick={handleSubmit} isSubmitting={isSubmitting} />
                </CardContent>
              </Card>
            )}

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}


export default WaitlistPage;