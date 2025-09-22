import { ObjectId } from "mongodb";
 
import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";
import { getFileType } from "@/app/lib/utils";
  

// ---------- GET (all additional files for a post) ----------
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Missing post ID" }), { status: 400 })
      );
    }

    const db = await connectToDatabase();
    const postCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const post = await postCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Post not found" }), { status: 404 })
      );
    }

    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: true, additionalFiles: post.additionalFiles || [] }),
        { status: 200 }
      )
    );
  } catch (err) {
    console.error("GET additional files error:", err);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to fetch additional files" }), { status: 500 })
    );
  }
}

// ---------- POST (add new additional files array to a post) ----------
export async function POST(req) {
  try {
    const body = await req.json();
    const { postId, additionalFiles } = body;

    if (!postId || !Array.isArray(additionalFiles)) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Invalid input" }), { status: 400 })
      );
    }

    const db = await connectToDatabase();
    const postCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { additionalFiles: { $each: additionalFiles } } }
    );

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, modifiedCount: updateResult.modifiedCount }), { status: 200 })
    );
  } catch (err) {
    console.error("POST additional files error:", err);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to add additional files" }), { status: 500 })
    );
  }
}

// ---------- PUT (update single additional file by index) ----------
export async function PUT(req) {
  try {
    const body = await req.json();
    const { postId, index, description, filepath } = body;

    if (!postId || index === undefined) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Invalid input" }), { status: 400 })
      );
    }

    const db = await connectToDatabase();
    const postCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const updateFields = {};
    const filetype = getFileType(filepath);
    if (description !== undefined) updateFields[`additionalFiles.${index}.description`] = description;
    if (filepath !== undefined) updateFields[`additionalFiles.${index}.filepath`] = filepath;
    if (filepath !== undefined) updateFields[`additionalFiles.${index}.filetype`] = getFileType(filepath) ;
     
    

    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: updateFields }
    );

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, modifiedCount: updateResult.modifiedCount }), { status: 200 })
    );
  } catch (err) {
    console.error("PUT additional file error:", err);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to update additional file" }), { status: 500 })
    );
  }
}

// ---------- DELETE (remove single additional file by index) ----------
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");
    const index = parseInt(searchParams.get("index"));

    if (!postId || isNaN(index)) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Invalid input" }), { status: 400 })
      );
    }

    const db = await connectToDatabase();
    const postCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const post = await postCollection.findOne({ _id: new ObjectId(postId) });
    if (!post || !Array.isArray(post.additionalFiles) || index >= post.additionalFiles.length) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "File not found" }), { status: 404 })
      );
    }

    // Remove file by index
    post.additionalFiles.splice(index, 1);

    await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { additionalFiles: post.additionalFiles } }
    );

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );
  } catch (err) {
    console.error("DELETE additional file error:", err);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to delete additional file" }), { status: 500 })
    );
  }
}
