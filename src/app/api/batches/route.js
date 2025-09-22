import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";
 
import { ObjectId } from "mongodb";

// GET all batches with pagination and filtering
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const filteredKeyword = searchParams.get("filteredkeyword") || "";
    const course = searchParams.get("course") || ""; // 👈 new param

    const db = await connectToDatabase();
    const batchCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_BATCHES);

    // Build query
    const query = {};

    if (course) {
      query.course = course; // exact match for course filter
    }

    if (filteredKeyword) {
      query.$or = [
        { course: { $regex: filteredKeyword, $options: "i" } },
        { name: { $regex: filteredKeyword, $options: "i" } },
        { shortCode: { $regex: filteredKeyword, $options: "i" } },
        { timeDetails: { $regex: filteredKeyword, $options: "i" } },
        { trainerDetails: { $regex: filteredKeyword, $options: "i" } },
        { status: { $regex: filteredKeyword, $options: "i" } },
      ];
    }

    const total = await batchCollection.countDocuments(query);
    const batches = await batchCollection
      .find(query)
      .sort({ createdTime: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          batches,
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
    console.error("GET batches error:", err);
    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: false, error: "Failed to fetch batches" }),
        { status: 500 }
      )
    );
  }
}


// POST new batch
export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const batchCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_BATCHES);

    const createdTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    const {
      course,
      name,
      shortCode,
      startDate,
      endDate,
      timeDetails,
      trainerDetails,
      status,
    } = await req.json();

    if (!course || !name) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Course and Name are required" }), {
          status: 400,
        })
      );
    }

    const result = await batchCollection.insertOne({
      course,
      name,
      shortCode,
      startDate,
      endDate,
      timeDetails,
      trainerDetails,
      status,
      createdTime,
    });

    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: true, message: "Batch created", insertedId: result.insertedId }),
        { status: 201 }
      )
    );
  } catch (err) {
    console.error("POST batches error:", err);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to create batch" }), { status: 500 })
    );
  }
}

// PUT update batch
export async function PUT(req) {
  try {
    const {
      id,
      course,
      name,
      shortCode,
      startDate,
      endDate,
      timeDetails,
      trainerDetails,
      status,
    } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
    }

    const db = await connectToDatabase();
    const batchCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_BATCHES);

    const updated = await batchCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          course,
          name,
          shortCode,
          startDate,
          endDate,
          timeDetails,
          trainerDetails,
          status,
        },
      }
    );

    if (updated.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "No batch updated" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Batch updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("PUT /api/batches error:", error);
    return new Response(JSON.stringify({ error: "Failed to update batch" }), { status: 500 });
  }
}

// DELETE batch
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
    const batchCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_BATCHES);

    const result = await batchCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Batch not found" }), { status: 404 })
      );
    }

    return withCorsHeaders(
      new Response(JSON.stringify({ success: true, message: "Batch deleted" }), { status: 200 })
    );
  } catch (err) {
    console.error("DELETE /api/batches error:", err);
    return withCorsHeaders(
      new Response(JSON.stringify({ success: false, error: "Failed to delete batch" }), { status: 500 })
    );
  }
}

// Ensure Node runtime
export const runtime = "nodejs";
