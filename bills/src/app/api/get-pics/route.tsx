import clientPromise from "@bills/mongodb";

export async function GET(req: Request) {
  const client = await clientPromise;
  const db = await client.db("bills");
  const images = await db.collection("images");
  return new Response(JSON.stringify(await images.find().toArray()), {
    status: 200,
  });
}
