// 'use client' directive ensures this file is treated as a React component for rendering on the client side
'use client';

import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, Autocomplete } from '@mui/material';
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { firestore } from '@/firebase';

// Theme colors to maintain consistency throughout the page
const themeColors = {
  background: '#FAF9F6',
  foreground: '#FAF9F6',
  primary: '#800000',
  primaryForeground: '#FAF9F6',
  muted: '#404040',
};

// List of teachers for the dropdown selection
const teachersList = ["Abdul Basit",
    "Abdullah M Yousuf",
    "Aadil Nakhoda",
    "Abdul Basit Shaikh",
    "Abdul Kaium Masud",
    "Abdul Majid",
    "Abdul Wahab Suri",
    "Adnan Haider",
    "Ahmad Azhar",
    "Aitzaz Ahsan",
    "Ali Gibran Siddiqui",
    "Amana Raquib",
    "Amer Awan",
    "Amer Iqbal Awan",
    "Amir Bashir",
    "Amir Hamza",
    "Amir Jehan Khan",
    "Arslan Waheed",
    "Asad Bilal",
    "Ashar Saleem",
    "Asim Shabir",
    "Ateeb Akhtar",
    "Azam Ali",
    "Azeem Hassan",
    "Azima Khan",
    "Babar Ahmed Qureshi",
    "Bilal Munshi",
    "Danish Ali",
    "Danish Iqbal Godil",
    "Engr Irfan Nabi",
    "Faisal Nazir",
    "Faisla Iradat",
    "Faiz ur Rehman",
    "Farah Naz Baig",
    "Farah Yasmeen",
    "Faraz Hyder",
    "Hafsa Ather Jafri",
    "Hassan Mahmood",
    "Hatim Fassi",
    "Heman Das Lohano",
    "Hisham Bin Zubair",
    "Huma Amir",
    "Huma Sodher",
    "Humera Naz",
    "Ilfan Oh",
    "Imran Khan",
    "Imran Rauf",
    "Irum Saba",
    "Ismat Abbas",
    "Jaffar Ahmed",
    "Javed Iqbal",
    "Jawwad Farid",
    "Junaid Alam",
    "Junaid Memon",
    "Khadija Bari",
    "Laila Farooq",
    "Lubna Naz",
    "Mohsin Patel",
    "Mohsin Sadaqat",
    "Mohsin Zahid Khawaja",
    "Moiz Hasan",
    "Moiz Khan",
    "Mudassir Uddin",
    "Muhammad Ayaz",
    "Muhammad Imtiaz",
    "Muhammad Nasir",
    "Muhammad Shafique",
    "Muhammad Sheraz",
    "Muhammad Yousuf Tufail",
    "Mujeeb u Rehman Bhayo",
    "Nadya Chishty Mujahid",
    "Nadya Qamar Chishty",
    "Nasir Afghan",
    "Nasir Touheed",
    "Nauman J Amin",
    "Nausheen Anwar",
    "Nausheen Wasi",
    "Naveed Ahmad",
    "Nazish Kanwal",
    "Nida Aslam Khan",
    "Noureen Khan",
    "Qazi Masood",
    "Sahar Arshad",
    "Sahar Awan",
    "Saima Saif",
    "Sajjad Ahmed",
    "Sajjad Haider",
    "Salman Khalid",
    "Salman Zaffar",
    "Sami Siddiqui",
    "Saqib Sharif",
    "Saqib ur Rehman",
    "Sara Khan",
    "Shabana Nisar",
    "Shahid Ashraf",
    "Shahid Hussain",
    "Shahid Mir",
    "Shahid Qureshi",
    "Shahid Zaki",
    "Shameel Khan",
    "Sharjeel Hasnie",
    "Shoaib Jamal",
    "Shumaila",
    "Syed Ali raza",
    "Syed Ali Raza Naqvi",
    "Syed Asim Ali",
    "Syed Inayat Ullah",
    "Syed Tauqeer Ahmed Hashmi",
    "Tahir Syed",
    "Tarik Yildirim",
    "Tariq Mahmood",
    "Tehzeeb Amir",
    "Ubedullah Khoso",
    "Umar Shahzad",
    "Usama Ehsan",
    "Usman Nazir",
    "Wajid Rizvi",
    "Wali Ullah",
    "Yasir Kundi",
    "Zaheer Ali",
    "Zeeshan Atiq",
    "Zeeshan Ullah",
    "Zulfiqar",
    "Francisco Merello",
    "Graduate Department",
    "Kashif Rashid",
    "Leroy Johns",
    "Mansoora Amini",
    "Abdul Hafeez",
    "Abu Tahir Siddique",
    "Abu Tahir Siddiqui",
    "Adnan Ahmad",
    "Ahmed Akhtar",
    "Ahmed Raza",
    "Ali Asghar Khurshid",
    "Ali Bolani",
    "Amir Khan",
    "Ammar Habib",
    "Aniq Hashmi",
    "Arif Irfanullah",
    "Asad Sajid",
    "Ayaz Shaikh",
    "Azfer Naseem",
    "Babur Khan Suri",
    "Behraj Khan",
    "Bilal Hayat But",
    "Ehsan Badar",
    "Farhan A Siddiqui",
    "Farhan Shaukat",
    "Farhan ul Haq Usmani",
    "Faseeh Ahmed",
    "Furqan Essani",
    "Ghias ul Hassan Khan",
    "Haroon Tabraze",
    "Hassaan Khalid",
    "Ijaz Ali",
    "Imran Javed",
    "Imran Shaheen",
    "Irfan Khan",
    "Irfan Muhammad",
    "Jafar Raza Rizvi",
    "Kamil Shahbazker",
    "Kamil Yousuf",
    "Khusrow Uzair",
    "Leon Menezes",
    "M Abdullah Yousuf",
    "M Zain Uddin",
    "Maqsood Alam",
    "Mohammad Sohaib Saleem",
    "Muhammad Naeem",
    "Muhammad Najam Uddin",
    "Muhammad Shahid Waheed",
    "Muhammad Umer Saeed",
    "Muzamil Patel",
    "Muzammil Patel",
    "Najmul Hassan",
    "Naveed Haider Bukhari",
    "Naveed Rabbani",
    "Rahat Aziz",
    "Rao M Noman",
    "Saad Usman",
    "Saher Iqbal",
    "Samar Jamil",
    "Saqib Ahmed",
    "Shahzad Ahmed",
    "Shahzeb Ahmed Hashim",
    "Sheikh Muhammad Irfan",
    "Syed Muhammad Ali Bukhari",
    "Ubaid-ur-Rehman",
    "Usman Ali",
    "Vishal Khemani",
    "Waseem Arain",
    "Yousuf Saudagar",
    "Zeeshan Bhayani",
    "Zenab Tariq",
    "Zohaib Aziz",
    "Zulfiqar Khan",
    "Palwashay Sethi",
    "Sobia Akber",
    "Muhammad Asif Jaffer",
    "Muniba Abdullah",
    "Nadeem Akhtar",
    "Akhter Raza Syed",
    "Syed Ahsan Kamal",
    "Syed Akbar Ali",
    "Syed Ali Ahmed",
    "Syed Atif Murtaza Qaiser",
    "Syed Farid Iqbal",
    "Syed Irfan Ahmed",
    "Syed Mujahid Ali",
    "Syed Shujaat Hussain",
    "Tehsen Mazhar Valjee"];

// WaitlistPage Component
const WaitlistPage = () => {
  const [email, setEmail] = useState('');
  const [reviews, setReviews] = useState([{ teacher: '', review: '' }]);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleReviewChange = (index, key, value) => {
    const updatedReviews = [...reviews];
    updatedReviews[index][key] = value;
    setReviews(updatedReviews);
  };

  const addReviewField = () => {
    setReviews([...reviews, { teacher: '', review: '' }]);
  };

  const validateForm = () => {
    if (!email) {
      setError('Please provide a valid email address.');
      return false;
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      setError('Please provide a Gmail address.');
      return false;
    }

    const uniqueReviews = Array.from(
      new Set(
        reviews
          .filter((review) => review.teacher && review.review)
          .map((review) => review.teacher)
      )
    );

    if (uniqueReviews.length < 3) {
      setError('Please provide unique reviews for at least 3 different teachers.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const ibaStudentsRef = doc(firestore, 'waitlist', 'iba-students');
      
      await setDoc(ibaStudentsRef, 
        { 
          emails: arrayUnion(email)
        }, 
        { merge: true }
      );

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

      console.log('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again later.');
    }
  };

  return (
    <Box sx={{ padding: '2rem', backgroundColor: themeColors.background, color: themeColors.muted }}>
      <Typography variant="h4" sx={{ color: themeColors.primary, marginBottom: '1rem' }}>
        Waitlist and Feedback Form
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Email Address"
            fullWidth
            value={email}
            onChange={handleEmailChange}
            sx={{
              backgroundColor: themeColors.foreground,
              '& .MuiInputBase-input': { color: themeColors.muted },
              '& .MuiInputLabel-root': { color: themeColors.muted },
            }}
          />
        </Grid>

        {reviews.map((review, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={teachersList}
                value={review.teacher}
                onChange={(e, value) => handleReviewChange(index, 'teacher', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Teacher"
                    fullWidth
                    required={index < 3}
                    sx={{
                      backgroundColor: themeColors.foreground,
                      '& .MuiInputBase-input': { color: themeColors.muted },
                      '& .MuiInputLabel-root': { color: themeColors.muted },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Review"
                multiline
                rows={4}
                fullWidth
                value={review.review}
                onChange={(e) => handleReviewChange(index, 'review', e.target.value)}
                required={index < 3}
                sx={{
                  backgroundColor: themeColors.foreground,
                  '& .MuiInputBase-input': { color: themeColors.muted },
                  '& .MuiInputLabel-root': { color: themeColors.muted },
                }}
              />
            </Grid>
          </React.Fragment>
        ))}

        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={addReviewField}
            disabled={reviews.length >= 10}
            sx={{
              borderColor: themeColors.primary,
              color: themeColors.primary,
              '&:hover': {
                backgroundColor: themeColors.primary,
                color: themeColors.primaryForeground,
              },
            }}
          >
            Add More Reviews
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              backgroundColor: themeColors.primary,
              color: themeColors.primaryForeground,
              '&:hover': {
                backgroundColor: themeColors.primaryForeground,
                color: themeColors.primary,
              },
            }}
          >
            Submit Feedback
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WaitlistPage;
