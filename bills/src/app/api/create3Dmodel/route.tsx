import { NextRequest } from "next/server";
import axios from 'axios'

const apiKey = process.env.MESHY_API_KEY;


export async function POST(request: NextRequest) {
  const headers = { Authorization: `Bearer ${apiKey}` };
  console.log("WHHSHSJHHS")
  const res = await request.json()
  const prompt = res.prompt
  
  const payload = {
    object_prompt: prompt,
    style_prompt: prompt,
    enable_pbr: true,
    resolution: '1024',
    art_style: 'fake-3d-cartoon',
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
    return new Response(JSON.stringify(error), {
      headers: { 'content-type': 'application/json' },
    });
  }


} 

