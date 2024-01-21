import clientPromise from "@bills/mongodb";
import { ObjectId } from "mongodb";


async function loadBufStr(stream: ReadableStream<Uint8Array>) {
  // lets have a ReadableStream as a stream variable
  const chunks: Uint8Array[] = [];

  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = await client.db("bills");
  const images = await db.collection("images");
  const data = req.body;

  if (!data) {
    return new Response("No id provided", { status: 400 });
  }

  const {id, amount} = JSON.parse(await loadBufStr(data));

  const result = await images.updateOne(
    { _id: new ObjectId(id) },
    {
      $inc: { upvotes: amount },
    }
  );

  return new Response(JSON.stringify(result), { status: 200 });
}
