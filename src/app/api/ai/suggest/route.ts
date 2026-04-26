import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const SERPAPI_KEY = process.env.SERPAPI_KEY;

export async function POST(req: Request) {
  try {
    const { link, isImage } = await req.json();

    if (!link) {
      return NextResponse.json({ error: 'Missing input link or image' }, { status: 400 });
    }

    let searchResults = '';

    if (isImage) {
      // SerpAPI Google Lens / Reverse Image Search
      const searchRes = await fetch(
        `https://serpapi.com/search.json?engine=google_lens&url=${encodeURIComponent(link)}&api_key=${SERPAPI_KEY}`
      );
      const data = await searchRes.json();
      searchResults = JSON.stringify(data.visual_matches || data.knowledge_graph || data);
    } else {
      // Standard search
      const searchRes = await fetch(
        `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(link)}&api_key=${SERPAPI_KEY}`
      );
      const data = await searchRes.json();
      searchResults = JSON.stringify(data.organic_results || data);
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert Arabic e-commerce product description writer. 
Based on the following raw search data, determine what the product is and write a highly engaging, converting product description.
CRITICAL RULES:
1. Always respond in Arabic.
2. DO NOT output plain paragraphs.
3. Your output MUST be rich HTML. Use <h3> for headings, <ul> and <li> for features/benefits. Use checkmarks (✅) in bullet points. Use <strong> for emphasis.
4. Output must be raw HTML string only, no markdown wrappers like \`\`\`html.
5. Create a catchy 'title' and a 'category' suggestion as well.
Output exclusively as a JSON object: {"title": "Arabic Title", "category": "General Category Name", "html_description": "<h3>...</h3><ul>..."}`
        },
        {
          role: 'user',
          content: `Search Data: ${searchResults.substring(0, 3000)}` 
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const aiRes = completion.choices[0]?.message?.content;
    const result = JSON.parse(aiRes || '{}');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Suggest API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
