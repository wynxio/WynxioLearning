import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const classProgressCollection = db.collection(process.env.NEXT_PUBLIC_CLASS_PROGRESS);

    const { searchParams } = new URL(req.url);
    const batch = searchParams.get("batch");

    if (!batch) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Missing batch parameter", data: null }), { status: 400 })
      );
    }

    // Find by batch and sort by classDate descending
    const data = await classProgressCollection
      .find({ batch })
      .sort({ classDate: -1 })
      .toArray();

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, error: null, data }), { status: 200 })
    );
  } catch (error) {
    console.error("API error (GET batchclassprogress):", error);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to fetch batch class progress", data: null }), { status: 500 })
    );
  }
}
