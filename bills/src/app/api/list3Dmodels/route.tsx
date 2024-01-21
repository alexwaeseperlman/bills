import { NextRequest } from "next/server";
import axios from 'axios'
import clientPromise from "@bills/mongodb";

const apiKey = process.env.MESHY_API_KEY;

export async function GET(request: NextRequest) {
   const client = await clientPromise;
   const db = await client.db("bills");
   const models = await (await db.collection("models")).find({}).toArray();

  return new Response(JSON.stringify(models), {
    status: 200,
  });
} 

