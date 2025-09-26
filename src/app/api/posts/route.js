 
import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";
 
import { randomUUID } from "crypto";
import fs from "fs";
import { ObjectId } from "mongodb";
import path from "path";
 

// Utility for saving files in /public/uploads

// GET all posts
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10); // default 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // default 10
    const skip = (page - 1) * limit;

    const skill = searchParams.get("skill") || "";
    const search = searchParams.get("search") || "";

    const db = await connectToDatabase();
    const postCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    // Build query
    const query = {};
    if (skill) {
      query.skill = skill;
    }
    if (search) {
      query.$or = [
        { section: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ];
    }

    const total = await postCollection.countDocuments(query);
    const posts = await postCollection
      .find(query)
      //.sort({ createdTime: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          posts,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        }),
        { status: 200 }
      )
    );
  } catch (err) {
    console.error("GET posts error:", err);
    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: false, error: "Failed to fetch posts" }),
        { status: 500 })
    );
  }
}



// POST new post
export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type");

    const db = await connectToDatabase();
    const postCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const createdTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    if (contentType.includes("application/json")) {
      // Text post
      const { skill,section, type, title, answer } = await req.json();

      if (!title) {
        return withCorsHeaders(
          new Response(JSON.stringify({ success: false, error: "Title isrequired" }), {
            status: 400,
          })
        );
      }

      const result = await postCollection.insertOne({
       skill,
       section,
        type,
        title,
        answer,
        createdTime,
      });

      return withCorsHeaders(
        new Response(
          JSON.stringify({ success: true, message: "post created", insertedId: result.insertedId }),
          { status: 201 }
        )
      );
    }



  } catch (err) {
    console.error("POST posts error:", err);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to create post" }), { status: 500 })
    );
  }
}

export async function PUT(req) {
  try {
    const { id, skill,section, type, title, answer  } = await req.json();

    if (!id || !title) {
      return new Response(JSON.stringify({ error: "ID and title are required" }), { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const updated = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: {  
        skill,
       section,
        type,
        title,
        answer } }
    );

    if (updated.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "No post updated" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Post updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("PUT /api/posts error:", error);
    return new Response(JSON.stringify({ error: "Failed to update post" }), { status: 500 });
  }
}

 

// Ensure Node runtime (needed for fs)
export const runtime = "nodejs";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Missing id" }), { status: 400 })
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection(process.env.NEXT_PUBLIC_TABLE_POSTS);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Post not found" }), { status: 404 })
      );
    }

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, message: "Post deleted" }), { status: 200 })
    );
  } catch (err) {
    console.error("DELETE /api/posts error:", err);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to delete post" }), { status: 500 })
    );
  }
}