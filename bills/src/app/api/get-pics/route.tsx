import clientPromise from "@bills/mongodb";

export async function GET(req: Request) {
  const client = await clientPromise;
  const db = await client.db("bills");
  const images = await db.collection("images");
  const data = await images.find({}).toArray();
  data.sort((a, b) => {
    return b.upvotes - a.upvotes;
  });
  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
