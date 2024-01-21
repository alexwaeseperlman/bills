import clientPromise from "@bills/mongodb";

async function loadBuf(stream: ReadableStream<Uint8Array>) {
  // lets have a ReadableStream as a stream variable
  const chunks: Uint8Array[] = [];

  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = await client.db("bills");
  const images = await db.collection("images");
  const image = req.body;
  if (!image) {
    return new Response("No image provided", { status: 400 });
  }

  const a = (await loadBuf(image));
  console.log(a.toString("base64").length);
  const result = await images.insertOne({
    image: a.toString("base64"),
    createdAt: new Date(),
    upvotes: 0,
  });
  return new Response(JSON.stringify(result), { status: 200 });
}
