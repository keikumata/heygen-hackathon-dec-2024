import OpenAI from 'openai';
import { Message } from '@/components/Chat';
import { promises as fs } from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load product data from JSON file
async function getProductData() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'knowledgeBase.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error loading product data:', error);
    throw new Error('Failed to load product data');
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response('OpenAI API key is missing', { status: 500 });
    }

    const body = await request.json();
    const { message, context, isIntroduction = false } = body;

    // Load product data
    const productData = await getProductData();
    const info = productData.ProductInformation;

    // Format product information for GPT
    const productContext = `
Product: ${info.ProductIntroduction.Product}
Description: ${info.ProductIntroduction.Description}

Key Features:
- ${info.ProductIntroduction.Features.BestInClassMat}
- ${info.ProductIntroduction.Features.HighDensityCushion}
- ${info.ProductIntroduction.Features.ResponsiblyMade}
- ${info.ProductIntroduction.Features.BreakingInYourMat}

Specifications:
- Size: ${info.TechnicalDetails.Size}
- Material: ${info.TechnicalDetails.Material}
- Weight: ${info.TechnicalDetails.ItemWeight}
- Color: ${info.TechnicalDetails.Color}

Green Mission:
${info.ProductIntroduction.GreenMission.Summary}
${info.ProductIntroduction.GreenMission.Certification}

Care Instructions:
${info.ProductIntroduction.CareInstructions.StandardCare}
    `.trim();

    // Different system messages for introduction vs Q&A
    const systemMessage = isIntroduction
      ? {
          role: "system" as const,
          content: `You are a knowledgeable yoga equipment specialist introducing the Manduka PRO Yoga Mat. Create an engaging, concise introduction (about 30 seconds when spoken) that highlights its key features, benefits, and eco-friendly aspects. Use this product information:

${productContext}`,
        }
      : {
          role: "system" as const,
          content: `You are a helpful yoga equipment specialist answering questions about the Manduka PRO Yoga Mat. Use this product information to provide accurate, friendly responses:

${productContext}

Focus on being helpful and specific, using technical details when relevant. If asked about topics not covered in the product information, be honest about not having that specific information.`,
        };

    const messages = [
      systemMessage,
      ...(isIntroduction
        ? []
        : context.map((msg: Message) => ({
            role: msg.username === "User" ? ("user" as const) : ("assistant" as const),
            content: msg.content,
          }))),
      {
        role: "user" as const,
        content: message,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: isIntroduction ? 0.7 : 0.6,
      max_tokens: isIntroduction ? 200 : 500,
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