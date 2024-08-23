import { useState, useEffect } from 'react';
import { TextField, Autocomplete, Box, Typography, Container, CircularProgress } from '@mui/material';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase";

const ReviewBox = ({ review, loading }) => (
    <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', marginTop: 2 }}>
        <Typography variant="h6">Teacher Review</Typography>
        {loading ? <CircularProgress /> : <Typography variant="body1">{review || "Select a teacher to see the review."}</Typography>}
    </Box>
);

const ReviewPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

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

            const postData = {
                teacher: teacherName,
                reviews: reviews,
                courses_taught: teacherCourses,
            };

            // console.log("Submitting data:", JSON.stringify(postData));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),  // Only send the latest teacher data
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const aiReview = await response.text();
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
        <Container sx={{ display: 'flex', flexDirection: 'column', maxWidth: '600px', marginTop: 4 }}>
            <Autocomplete
                options={teachers}
                value={selectedTeacher}
                onChange={handleTeacherChange}
                renderInput={(params) => (
                    <TextField {...params} label="Select or Search for a Teacher" variant="outlined" fullWidth />
                )}
            />
            <ReviewBox review={review} loading={loading} />
        </Container>
    );
};

export default ReviewPage;
