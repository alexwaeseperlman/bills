import { NextRequest } from "next/server";
import axios from 'axios'

const apiKey = process.env.MESHY_API_KEY;


export async function POST(request: NextRequest) {
  const headers = { Authorization: `Bearer ${apiKey}` };
  
  const payload = {
    object_prompt: 'a devil monster mask',
    style_prompt: 'red fangs, Samurai outfit that fused with japanese batik style',
    enable_pbr: true,
    resolution: '1024',
    art_style: 'realistic',
    negative_prompt: 'low quality, low resolution, low poly, ugly',
  };

  try {
    const response = await axios.post('https://api.meshy.ai/v1/text-to-3d', payload, { headers });
    console.log(response.data);
    return new Response(JSON.stringify(response.data), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
  }
} 