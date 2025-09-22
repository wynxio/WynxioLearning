 
import connectToDatabase from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
 

export async function GET(req, { params }) {
  try {
     
    const db = await connectToDatabase();
    const postCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

if (!ObjectId.isValid(params.id)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid post id" }),
        { status: 400 }
      );
    }

    const post = await postCollection.findOne({ _id: new ObjectId(params.id) });

    if (!post) {
      return new Response(
        JSON.stringify({ success: false, error: "Post not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, post }), { status: 200 });
  } catch (err) {
    console.error("GET post error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch post" }),
      { status: 500 }
    );
  }
}
