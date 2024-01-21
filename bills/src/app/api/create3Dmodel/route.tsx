import { NextRequest } from "next/server";
import axios from "axios";
import clientPromise from "@bills/mongodb";

const apiKey = process.env.MESHY_API_KEY;

export async function POST(request: NextRequest) {
  const client = await clientPromise;
  const db = await client.db("bills");
  const models = await db.collection("models");

  const headers = { Authorization: `Bearer ${apiKey}` };
  console.log("WHHSHSJHHS");
  const res = await request.json();
  const prompt = res.prompt;

  const payload = {
    object_prompt: prompt,
    style_prompt: prompt,
    enable_pbr: true,
    resolution: "1024",
    art_style: "fake-3d-cartoon",
    negative_prompt: "low quality, low resolution, low poly, ugly",
  };

  try {
    const response = await axios.post(
      "https://api.meshy.ai/v1/text-to-3d",
      payload,
      { headers }
    );

    // poll until the task is done

    const taskId = response.data.result;
    await models.insertOne({
      createdAt: new Date(),
      prompt: prompt,
      taskId,
    });

    const int = setInterval(async () => {
      const response = await axios.get(
        `https://api.meshy.ai/v1/text-to-3d/${taskId}`,
        { headers }
      );
      console.log('polling', response.data)
      if (response.data.status === "SUCCEEDED") {
        await models.updateOne({
          createdAt: new Date(),
          prompt: prompt,
          taskId: response.data.result,
        }, {
          $set: {
            url: response.data.model_urls.glb,
            thumbnail: response.data.thumbnail_url,
          }
        });
        clearInterval(int);
      }
    }, 3000);

    console.log(response.data);
    return new Response(JSON.stringify(response.data), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), {
      headers: { "content-type": "application/json" },
    });
  }
}
