import OpenAI from 'openai';
import { Message } from '@/components/Chat';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

interface Product {
  id: string;
  name: string;
  introduction: string;
  originalPrice: number;
  salePrice: number;
  discount: string;
  questionsAnswered: number;
  maxQuestions: number;
  details: Record<string, any>;
}

interface KnowledgeBase {
  hostIntroduction: string;
  products: Product[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemMessage = `You are a live shopping host showcasing products to customers. Your responses should be:
- Enthusiastic and engaging while maintaining professionalism
- Focused on highlighting product benefits and features
- Factual and based on available product information
- Natural in tone, as if speaking to viewers live
- Concise but informative
- Sales-oriented but not pushy`;

async function getProductData(): Promise<KnowledgeBase> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'knowledgeBase.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error loading product data:', error);
    throw new Error('Failed to load product data');
  }
}

async function updateQuestionCount(productId: string): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'knowledgeBase.json');
    const data = await getProductData();
    const product = data.products.find(p => p.id === productId);
    
    if (product) {
      product.questionsAnswered += 1;
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error updating question count:', error);
  }
}

function formatMessage(msg: Message) {
  return {
    role: msg.username === "User" ? "user" : "assistant",
    content: msg.content
  };
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is missing' }, { status: 500 });
    }

    const body = await request.json();
    const { message, context, productId, isIntroduction } = body;

    const productData = await getProductData();
    const product = productData.products.find(p => p.id === productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!isIntroduction && product.questionsAnswered >= product.maxQuestions) {
      return NextResponse.json({ 
        error: 'Maximum questions reached for this product',
        questionsAnswered: product.questionsAnswered,
        maxQuestions: product.maxQuestions
      }, { status: 403 });
    }

    const productContext = `
Product: ${product.name}
Price: Original $${product.originalPrice}, Sale Price $${product.salePrice} (${product.discount} off)
Details: ${JSON.stringify(product.details, null, 2)}
    `.trim();

    const messages = [
      { role: "system", content: systemMessage },
      {
        role: "system",
        content: `You are answering questions about ${product.name}. Product information: ${productContext}`
      },
      ...(!isIntroduction ? context.filter(msg => msg.productId === productId).map(formatMessage) : []),
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.6,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content;

    if (!isIntroduction) {
      await updateQuestionCount(productId);
    }

    return NextResponse.json({
      response,
      questionsAnswered: product.questionsAnswered + 1,
      maxQuestions: product.maxQuestions
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate response',
      details: error.message 
    }, { status: 500 });
  }
}