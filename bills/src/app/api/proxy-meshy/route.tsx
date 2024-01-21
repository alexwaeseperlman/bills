import { NextRequest } from "next/server";
import axios from "axios";

const apiKey = process.env.MESHY_API_KEY;

export async function GET(request: NextRequest) {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };
  const url = decodeURIComponent(request.nextUrl.searchParams.get("url") ?? "");
  console.log("url", url);
  const targ = "https://assets.meshy.ai" + url;
  console.log("targ", targ);
  const res = await axios.get(targ, { headers });

  const body = await res.data;

  return new Response(body, {
    status: 200,
  });
}
