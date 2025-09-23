import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";
import { getFileType } from "@/app/lib/utils";
import { ObjectId } from "mongodb";
 

// GET with pagination
export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const filesCollection = db.collection(process.env.NEXT_PUBLIC_UploadedFiles);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    const total = await filesCollection.countDocuments();
    const data = await filesCollection.find({})
        .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          error: null,
          data,
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("API error (GET uploadedfiles):", error);
    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: false, error: "Failed to fetch uploaded files", data: null }),
        { status: 500 }
      )
    );
  }
}

// POST (Add new file)
export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const filesCollection = db.collection(process.env.NEXT_PUBLIC_UploadedFiles);

    const body = await req.json();
    const { description, link } = body;

    if (!description || !link) {
      return withCorsHeaders(
        new Response(
          JSON.stringify({ success: false, error: "Missing required fields: description or link" }),
          { status: 400 }
        )
      );
    }

    const insertData = {
      description,
      link,
      filetype: getFileType(link),
      createdAt: new Date(),
    };

    const result = await filesCollection.insertOne(insertData);

    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          error: null,
          data: { insertedId: result.insertedId },
        }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("API error (POST uploadedfiles):", error);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Error saving file" }), { status: 500 })
    );
  }
}

// PUT (Update file by ID)
export async function PUT(req) {
  try {
    const db = await connectToDatabase();
    const filesCollection = db.collection(process.env.NEXT_PUBLIC_UploadedFiles);

    const body = await req.json();
    const { id, description, link } = body;

    if (!id || !ObjectId.isValid(id)) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Invalid or missing ID" }), { status: 400 })
      );
    }

    const updateData = {};
    if (description) updateData.description = description;
    if (link) {
      updateData.link = link;
      updateData.filetype = getFileType(link);
    }

    const result = await filesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: true, error: null, data: { modifiedCount: result.modifiedCount } }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("API error (PUT uploadedfiles):", error);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Error updating file" }), { status: 500 })
    );
  }
}

// DELETE (Remove file by ID)
export async function DELETE(req) {
  try {
    const db = await connectToDatabase();
    const filesCollection = db.collection(process.env.NEXT_PUBLIC_UploadedFiles);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Invalid or missing ID" }), { status: 400 })
      );
    }

    const result = await filesCollection.deleteOne({ _id: new ObjectId(id) });

    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: true, error: null, data: { deletedCount: result.deletedCount } }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("API error (DELETE uploadedfiles):", error);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Error deleting file" }), { status: 500 })
    );
  }
}
