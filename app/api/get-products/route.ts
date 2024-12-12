import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'knowledgeBase.json');
    const data = await fs.readFile(filePath, 'utf8');
    const knowledgeBase = JSON.parse(data);
    
    return NextResponse.json({ products: knowledgeBase.products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}