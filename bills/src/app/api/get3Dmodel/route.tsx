import axios from "axios";
import { type NextRequest } from "next/server";

const apiKey = process.env.MESHY_API_KEY;

const cache = new Map();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const taskId = searchParams.get("taskId");
  console.log("GET request received");

  const headers = { Authorization: `Bearer ${apiKey}` };

  try {
    const response = await axios.get(
      `https://api.meshy.ai/v1/text-to-3d/${taskId}`,
      { headers }
    );
    console.log(response.data);
    return new Response(JSON.stringify(response.data), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to handle it outside this function
  }
}
