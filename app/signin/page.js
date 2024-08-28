'use client';
import { React, useState } from 'react';
import { AppBar, Toolbar, Container, Box, Typography, TextField, Button, Link, FormControl, Card } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

/////////////////////////////////////// Main Component ////////////////////////////////////////

const SignIn = () => {

    //router to direct to given page
    const router = useRouter();
    //states for User Email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // state for Error Message
    const [error, setError] = useState('');

    ////////////////////////SignIn backend Logic ////////////////////
    const handleSignIn = async (e) => {
        //Prevents the default form submission behavior.
        e.preventDefault();
        //Reset Error state
        setError('')
        if (email === '' || password == '') return;
        try {
            await signInWithEmailAndPassword(auth, email, password);  //if smth is wrong it will throw error
            router.push("./review-page");  //it will direct to chat Interface after Successful login
        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';
            switch (error.message) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No user found with this email.';
                    break;
                default:
                    errorMessage = 'Failed to sign in. Please check your credentials';
            }
            setError(errorMessage);
        }
    }

    return (
        <Box sx={{
            backgroundImage: 'url(/reviewpage-blurred.jpg)', // Set page background to bg.png image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            minWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}>

            {/*//////////////////////// SignIn Page ////////////////////////// */}

            <Card sx={{
                width: { xs: '90%', sm: '70%', md: '60%', lg: '40%' }, // Fixed width for different screen sizes
                maxWidth: '400px', // Maximum width to prevent excessive expansion 
                minHeight: '400px', // Added minimum height to prevent expansion on error
                p: { xs: 4, sm: 5, md: 6 }, // Adjust padding for different screen sizes
                bgcolor: 'rgba(255,255,255,0.5)', // Translucent glassy background for the card
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // Ensure proper spacing of content
            }}>
                <Box sx={{ color: '#121212' }}>
                    <FormControl sx={{ width: '100%' }}>
                        <Typography
                            variant='h4'
                            sx={{
                                pt: '20px',
                                pb: '20px',
                                textAlign: 'center',
                            }}
                        >Sign In</Typography>

                        {/* //////////////////// Email Text Field///////////// */}

                        <TextField id="Emailbox"
                            label="Email Address*"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
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


                            ////// Label things handling ////////

                            InputLabelProps={{
                                //sx- syntax bit changed here
                                sx: {
                                    //default Label color
                                    color: '#121212',
                                    //label color when focused
                                    '&.Mui-focused': {
                                        color: '#121212'
                                    }

                                }
                            }}
                        />

                        {/* br's used for just gap */}
                        <br />
                        <br />

                        {/* //////////////////// Password Text Field///////////// */}

                        <TextField id="Passwordbox"
                            label="Password*"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
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


                            ////// Label things handling ////////

                            InputLabelProps={{
                                //sx- syntax bit changed here
                                sx: {
                                    //default Label color
                                    color: '#121212',
                                    //label color when focused
                                    '&.Mui-focused': {
                                        color: '#121212'
                                    }

                                }
                            }}
                        />

                        {/* br's used for just gap */}
                        <br />

                        {/*///////// Error Display /////////*/}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minHeight: '24px',
                                textAlign: 'center'

                            }}>
                            {error && (
                                <Typography variant='caption' sx={{ color: '#800000', mb: 1 }}>
                                    {error}
                                </Typography>
                            )}
                            <Button
                                fullWidth
                                sx={{

                                    color: 'white',
                                    backgroundColor: '#800000',
                                    borderRadius: '50px',
                                    '&:hover': {
                                        color: '#800000',
                                        backgroundColor: 'rgba(255,255,255,1)',
                                    }
                                }}
                                onClick={handleSignIn}
                            >Sign in</Button>
                        </Box>

                        {/* ///////////  Sign In Button ///////////// */}

                    </FormControl>
                </Box>
            </Card>
        </Box>
    );
}

export default SignIn;