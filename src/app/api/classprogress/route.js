import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";
import { getFileType } from "@/app/lib/utils";

import { ObjectId } from "mongodb";
 

export async function GET() {
  try {
    const db = await connectToDatabase();
    const classProgressCollection = db.collection(process.env.NEXT_PUBLIC_CLASS_PROGRESS);

    const data = await classProgressCollection.find({}).toArray();

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, error: null, data }), { status: 200 })
    );
  } catch (error) {
    console.error("API error (GET classprogress):", error);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to fetch class progress", data: null }), { status: 500 })
    );
  }
}

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const classProgressCollection = db.collection(process.env.NEXT_PUBLIC_CLASS_PROGRESS);

    const body = await req.json();
    const { classDate, description, publish,batch } = body;

    if (!classDate || !Array.isArray(description)) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Missing classDate or description array" }), { status: 400 })
      );
    }

    const newEntry = {
      classDate,
      batch,
      description: description.map(d => ({ description: d.description || '', link: d.link || '',filetype:getFileType(d.link) })),
      publish: publish ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await classProgressCollection.insertOne(newEntry);

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, error: null }), { status: 200 })
    );
  } catch (error) {
    console.error("API error (POST classprogress):", error);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Error saving class progress" }), { status: 500 })
    );
  }
}

export async function PUT(req) {
  try {
    const db = await connectToDatabase();
    const classProgressCollection = db.collection(process.env.NEXT_PUBLIC_CLASS_PROGRESS);

    const body = await req.json();
    const { id, classDate, description, publish,batch } = body;

    if (!id || !classDate || !Array.isArray(description)) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Missing id, classDate, or description" }), { status: 400 })
      );
    }

    const updateData = {
      classDate,
      batch,
      description: description.map(d => ({ description: d.description || '', link: d.link || '',filetype:getFileType(d.link) })),
      publish: publish ?? false,
      updatedAt: new Date()
    };

    const result = await classProgressCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Record not found" }), { status: 404 })
      );
    }

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, error: null }), { status: 200 })
    );
  } catch (error) {
    console.error("API error (PUT classprogress):", error);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Error updating class progress" }), { status: 500 })
    );
  }
}

export async function DELETE(req) {
  try {
    const db = await connectToDatabase();
    const classProgressCollection = db.collection(process.env.NEXT_PUBLIC_CLASS_PROGRESS);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Missing id" }), { status: 400 })
      );
    }

    const result = await classProgressCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Record not found" }), { status: 404 })
      );
    }

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, error: null }), { status: 200 })
    );
  } catch (error) {
    console.error("API error (DELETE classprogress):", error);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Error deleting class progress" }), { status: 500 })
    );
  }
}
