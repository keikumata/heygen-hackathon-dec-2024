import OpenAI from 'openai';
import { Message } from '@/components/Chat';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response('OpenAI API key is missing', { status: 500 });
    }

    const body = await request.json();
    const { message, context } = body;

    // Convert the chat context into a format OpenAI can understand
    const messages = [
      {
        role: "system",
        content: "You are a helpful shopping assistant for a live stream shopping platform. You help customers learn about products and make purchasing decisions. Keep your responses friendly, concise, and focused on helping customers.",
      },
      // Add previous messages from context
      ...context.map((msg: Message) => ({
        role: msg.username === "User" ? "user" : "assistant",
        content: msg.content,
      })),
      // Add the current message
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 
      "I apologize, but I'm having trouble generating a response right now.";

    return new Response(JSON.stringify({ response }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error('Error generating response:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        details: error.message 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
