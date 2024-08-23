import { useState, useEffect, useRef } from 'react';
import { Avatar, TextField, IconButton, Paper, Container, Typography, Box, Autocomplete } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { styled } from '@mui/system';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown



// Custom SVG icon components
function ArrowUpIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="m5 12 7-7 7 7" />
			<path d="M12 19V5" />
		</svg>
	);
}

const GlassBox = styled(Paper)(({ theme }) => ({
	backdropFilter: 'blur(10px)',
	backgroundColor: 'rgba(255, 255, 255, 0.2)',
	borderRadius: '16px',
	padding: theme.spacing(2),
	marginBottom: theme.spacing(2),
	boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
	position: 'relative',
	zIndex: 3,
	maxWidth: '80vw'
}));

const GradientLayer = styled('div')({
	position: 'absolute',
	width: '100%',
	height: '100%',
	top: 0,
	left: 0,
	zIndex: 1,
	background: 'radial-gradient(circle at top left, rgba(255,0,150,0.5), transparent), radial-gradient(circle at bottom right, rgba(0,205,255,0.5), transparent)',
	opacity: 0.6,
	filter: 'blur(50px)',
});

const BackgroundLayer = styled('div')({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: 'black',
	zIndex: 0,
});

const MessageContainer = styled(Box, { shouldForwardProp: (prop) => prop !== 'isUser' })(({ isUser }) => ({
	display: 'flex',
	flexDirection: isUser ? 'row-reverse' : 'row',
	alignItems: 'flex-start',
	gap: '8px',
	marginBottom: '16px',
}));

const ChatPage = () => {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [teachers, setTeachers] = useState([]);
	const [selectedTeacher, setSelectedTeacher] = useState("");

	const messagesEndRef = useRef(null);

	useEffect(() => {
		fetch("/teachers.json")
			.then((response) => response.json())
			.then((data) => setTeachers(data));
	}, []);

	const handleTeacherChange = (event, value) => {
		setMessage(value);
	};

	// Helper Functions
	const addUserAndPlaceholderMessages = (message, setMessages) => {
		setMessages((prevMessages) => [
			...prevMessages,
			{ role: 'user', content: message },
			{ role: 'assistant', content: '' },
		]);
	};

	const handleServerResponse = async (reader, decoder, setMessages) => {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const text = decoder.decode(value, { stream: true });
			updateLastMessage(text, setMessages);
		}
	};

	const updateLastMessage = (text, setMessages) => {
		setMessages((prevMessages) => {
			let lastMessage = prevMessages[prevMessages.length - 1];
			let otherMessages = prevMessages.slice(0, prevMessages.length - 1);

			return [
				...otherMessages,
				{ ...lastMessage, content: lastMessage.content + text },
			];
		});
	};

	const handleError = (setMessages) => {
		setMessages((prevMessages) => [
			...prevMessages,
			{
				role: 'assistant',
				content: "I'm sorry, but I encountered an error. Please try again later.",
			},
		]);
	};

	const sendMessage = async () => {
		if (!message.trim() || isLoading) return;
		setIsLoading(true);

		addUserAndPlaceholderMessages(message, setMessages);
		setMessage('');

		try {
			const teacherKey = `${selectedTeacher.replace(/[.\s]/g, "").toLowerCase()}`;

			const coursesResponse = await fetch("/teachers_courses.json");
			const coursesData = await coursesResponse.json();
			const teacherCourses = coursesData[teacherKey]?.courses_taught || [];

			// Fetch teacher reviews from Firestore
			const teacherRef = doc(firestore, "teachers", teacherKey);
			const teacherDoc = await getDoc(teacherRef);
			let reviews = teacherDoc.exists() ? teacherDoc.data().reviews || [] : [];
			// Data to send in the POST request
			const postData = {
				teacher: selectedTeacher,
				reviews: reviews,
				courses_taught: teacherCourses,
			};

			console.log("Submitting data:", JSON.stringify(postData));



			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify([...messages, { role: 'user', content: postData }]),
			});

			if (!response.ok) throw new Error('Network response was not ok');

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			await handleServerResponse(reader, decoder, setMessages);
		} catch (error) {
			console.error('Error:', error);
			handleError(setMessages);
		}

		setIsLoading(false);
	};

	const handleKeyPress = (event) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<Container
			maxWidth={false}
			sx={{
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<BackgroundLayer />
			<GradientLayer />
			<Box
				sx={{
					flexGrow: 1,
					overflowY: 'auto',
					marginBottom: '16px',
					zIndex: 2,
					paddingTop: '20px',
					paddingRight: '5px',
					paddingBottom: 'env(safe-area-inset-bottom)',
					'&::-webkit-scrollbar': {
						width: '8px',
						background: 'transparent',
					},
					'&::-webkit-scrollbar-track': {
						background: 'transparent',
					},
					'&::-webkit-scrollbar-thumb': {
						background: 'transparent',
						borderRadius: '10px',
						transition: 'background 5s ease',
					},
					'&::-webkit-scrollbar-thumb:hover': {
						background: 'rgba(255, 255, 255, 0.2)',
					},
				}}
			>
				{messages.map((msg, index) => (
					<MessageContainer key={index} isUser={msg.role === 'user'}>
						<div
							style={{
								borderRadius: '50%',
								width: '40px',
								height: '40px',
								backgroundColor: 'rgba(255, 255, 255, 0.2)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Avatar
								sx={{
									width: '32px',
									height: '32px',
									bgcolor: 'transparent',
									border: '1px solid rgba(255, 255, 255, 0.3)',
									boxShadow: 'none',
								}}
							>
								<AccountCircle sx={{ fontSize: '1.5rem', color: 'white' }} />
							</Avatar>
						</div>
						<GlassBox>
							<Typography variant="body2" color="white">
								{/* Render message content with Markdown */}
								<ReactMarkdown>{msg.content}</ReactMarkdown>
							</Typography>
						</GlassBox>
					</MessageContainer>
				))}
				<div ref={messagesEndRef} />
			</Box>
			{/* <Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					// maxWidth:
				}}
			> */}

			<GlassBox
				sx={{
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					paddingBottom: `calc(env(safe-area-inset-bottom) + 16px)`,
					maxWidth: '100%'
				}}
			>
				<Autocomplete
					options={teachers}
					value={selectedTeacher}
					onChange={(event, value) => {
						setSelectedTeacher(value);
						setMessage(value); // Keep this for chat input
					}}
					isOptionEqualToValue={(option, value) => option === value}
					renderInput={(params) => (
						<TextField {...params} label="Select or Search for a Teacher" variant="outlined" fullWidth />
					)}
					sx={{ flexGrow: 1, mr: 2 }}
				/>
				<IconButton
					color="primary"
					sx={{ ml: 1 }}
					onClick={sendMessage}
					disabled={isLoading}
				>
					<ArrowUpIcon style={{ color: 'white' }} />
				</IconButton>
			</GlassBox>
			{/* </Box> */}
		</Container >
	);
};

export default ChatPage;
