import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { getChatModel } from '@/app/lib/langchain';
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export async function POST(request: Request) {
  try {
    const { message, context, isIntroduction, productId } = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'knowledgeBase.json');
    const data = await fs.readFile(filePath, 'utf8');
    const knowledgeBase = JSON.parse(data);

    if (isIntroduction && !productId) {
      return NextResponse.json({ response: knowledgeBase.intro });
    }
    
    if (isIntroduction && productId) {
      const product = knowledgeBase.products.find((p: any) => p.id === productId);
      return NextResponse.json({ response: product.intro });
    }
    
    const product = knowledgeBase.products.find((p: any) => p.id === productId);
    const systemPrompt = `You are a shopping assistant specifically answering questions about the ${product.name}. Use this context: ${product.intro}\n\n${product.context}. Be concise and to the point in your answer, under 2 sentences.`;

    // Initialize the chat model (can be easily switched between providers)
    const chatModel = getChatModel("anthropic"); // or "openai"

    const response = await chatModel.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(message)
    ]);

    return NextResponse.json({ response: response.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}