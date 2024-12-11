import OpenAI from 'openai';
import { Message } from '@/components/Chat';
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/response';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getProductData() {
  const filePath = path.join(process.cwd(), 'public', 'knowledgeBase.json');
  const jsonData = await fs.readFile(filePath, 'utf8');
  return JSON.parse(jsonData);
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key missing' }, { status: 500 });
    }

    const body = await request.json();
    const { message, context, productId } = body;

    const productData = await getProductData();
    const product = productData.products.find((p: any) => p.id === productId);

    const systemMessage = {
      role: "system" as const,
      content: `You are a helpful shopping assistant answering questions about ${product.name}. Use this product information: ${JSON.stringify(product.details)}`,
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...context.map((msg: Message) => ({
          role: msg.username === "User" ? "user" as const : "assistant" as const,
          content: msg.content,
        })),
        { role: "user" as const, content: message }
      ],
      temperature: 0.6,
      max_tokens: 500,
    });

    return NextResponse.json({ 
      response: completion.choices[0]?.message?.content || "Error generating response"
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}