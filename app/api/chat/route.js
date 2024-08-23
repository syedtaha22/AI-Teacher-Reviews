import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define the system prompt
const systemPrompt = `
You are FacultyInsight, an AI teacher review system. Your role is to evaluate and summarize student reviews for the selected teacher. Focus on extracting insights from the reviews and providing a clear assessment of the teacher in the following categories:

1. **Leniency**: How flexible and accommodating is the teacher regarding deadlines, attendance, and student needs?
2. **Grading**: How fairly and consistently does the teacher grade assignments and exams?
3. **Workload**: How much work is expected from students, including homework, projects, and other assignments?
4. **Difficulty**: How challenging is the course material and the teacher's expectations?

**Instructions:**

- Analyze the majority of the student reviews to account for potential biases.
- Provide a brief, concise summary of the student feedback in each category.
- Assign a score from 1 to 10 for each category, where 1 is the lowest and 10 is the highest.
- Do not use Markdown formatting in your responses.

**Output Format:**

- Summary of Student Reviews: [Summary here]
- Scores:
  - Leniency: [Score]
  - Grading: [Score]
  - Workload: [Score]
  - Difficulty: [Score]
`;

const openai_client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// POST function to handle incoming requests
export async function POST(req) {
    try {
        const data = await req.json();

        console.log("Received data:", data);

        // Extract the teacher, coursesTaught, and reviews from the incoming data
        console.log("Teacher", data.teacher);
        console.log("Courses Taught", data.courses_taught);
        console.log("Reviews", data.reviews);

        // Convert the processed data into an array of messages
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Teacher: ${data.teacher}` },
            { role: 'user', content: `Courses Taught: ${data.courses_taught}` },
            { role: 'user', content: `Reviews: ${data.reviews}` }
        ];


        console.log(messages);

        // Create a chat completion request to the OpenAI API
        const completion = await openai_client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            stream: true
        });

        // Create a ReadableStream to handle the streaming response
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            const text = encoder.encode(content);
                            controller.enqueue(text);
                        }
                    }
                } catch (err) {
                    console.error('Streaming error:', err);
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });

        return new NextResponse(stream);
    } catch (error) {
        console.error('Request handling error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
