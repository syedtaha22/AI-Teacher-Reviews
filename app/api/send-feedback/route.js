// app/api/send-feedback/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function generateFeedbackEmail(name, email, rating, comments) {
    return {
        from: process.env.GMAIL_USER,
        to: 'facultyinsights@gmail.com',
        subject: 'New Feedback Received',
        text:
            "Hi Team,\n\n" +
            "We have just received new feedback on our platform. Here are the details:\n\n" +
            "--------------------------------\n" +
            "Name:           " + name + "\n" +
            "Email:          " + email + "\n" +
            "Rating:         " + rating + " / 5\n" +
            "--------------------------------\n\n" +
            "Feedback Comments:\n" +
            comments + "\n\n" +
            "--------------------------------\n\n" +
            "This feedback was submitted by " + name + ", who rated their experience " + rating + " out of 5. Please review the comments to identify any action items or opportunities for improvement.\n\n" +
            "If the feedback suggests an issue or an area of concern, consider following up with " + name + " at " + email + " to address their concerns.\n\n" +
            "Let's continue working together to enhance our platform and provide the best possible experience for our users.\n\n" +
            "Best regards,\n" +
            "Our Platform Team"
    };
}


export async function POST(request) {
    const { name, email, rating, comments } = await request.json();

    try {
        // Create a transporter object using SMTP
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Your Gmail address
                pass: process.env.GMAIL_PASS, // Your Gmail password or app-specific password
            },
        });

        // Define email options
        const mailOptions = generateFeedbackEmail(name, email, rating, comments);

        // Send the email
        await transporter.sendMail(mailOptions);

        // Respond with a success message
        return NextResponse.json({ message: 'Feedback sent successfully!' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error sending feedback.' }, { status: 500 });
    }
}
