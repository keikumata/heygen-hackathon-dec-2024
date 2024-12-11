import { NextResponse } from 'next/response';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message, context, productId, type } = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'knowledgeBase.json');
    const data = await fs.readFile(filePath, 'utf8');
    const knowledgeBase = JSON.parse(data);
    
    if (type === 'stream') {
      const product = knowledgeBase.products.find((p: any) => p.id === productId);
      return NextResponse.json({ script: product.speech });
    }

    const product = knowledgeBase.products.find((p: any) => p.id === productId);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `You are a shopping assistant specifically answering questions about the ${productId}. Use this context: ${product.speech}` 
        },
        ...context,
        { role: "user", content: message }
      ],
      temperature: 0.6,
      max_tokens: 500,
    });

    return NextResponse.json({ response: completion.choices[0]?.message?.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}