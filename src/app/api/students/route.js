import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// GET all students with pagination and filtering
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const filteredKeyword = searchParams.get("filteredkeyword") || "";

    const db = await connectToDatabase();
    const studentCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_STUDENTS);

    // Build query
    const query = {};
    if (filteredKeyword) {
      query.$or = [
        { name: { $regex: filteredKeyword, $options: "i" } },
        { email: { $regex: filteredKeyword, $options: "i" } },
        { phone: { $regex: filteredKeyword, $options: "i" } },
        { address: { $regex: filteredKeyword, $options: "i" } },
        { qualification: { $regex: filteredKeyword, $options: "i" } },
        { team: { $regex: filteredKeyword, $options: "i" } },
        { comments: { $regex: filteredKeyword, $options: "i" } },
      ];
    }

    const total = await studentCollection.countDocuments(query);
    const students = await studentCollection
      .find(query)
      .sort({ createdTime: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          students,
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
    console.error("GET students error:", err);
    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: false, error: "Failed to fetch students" }),
        { status: 500 }
      )
    );
  }
}

// POST new student
export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const studentCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_STUDENTS);

    const createdTime = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const body = await req.json();
    const {
      username,
      password,
      name,
      email,
      phone,
      address,
      qualification,
      team,
      confirmedfees,
      comments,
      fees1,
      fees2,
      fees3,
      fees4,
      fees5,
      allowedSkills = [],   // ✅ new field
    } = body;

    if (!username || !password || !name) {
      return withCorsHeaders(
        new Response(
          JSON.stringify({
            success: false,
            error: "username, password, and name are required",
          }),
          { status: 400 }
        )
      );
    }

    const result = await studentCollection.insertOne({
      username,
      password,
      name,
      email,
      phone,
      address,
      qualification,
      team,
      confirmedfees,
      comments,
      fees1,
      fees2,
      fees3,
      fees4,
      fees5,
      allowedSkills,  // ✅ stored in DB
      createdTime,
    });

    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          message: "student created",
          insertedId: result.insertedId,
        }),
        { status: 201 }
      )
    );
  } catch (err) {
    console.error("POST students error:", err);
    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: false, error: "Failed to create student" }),
        { status: 500 }
      )
    );
  }
}

// PUT update student
export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      id,
      username,
      password,
      name,
      email,
      phone,
      address,
      qualification,
      team,
      confirmedfees,
      comments,
      fees1,
      fees2,
      fees3,
      fees4,
      fees5,
      allowedSkills = [],   // ✅ new field
    } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }

    const db = await connectToDatabase();
    const studentCollection = db.collection(
      process.env.NEXT_PUBLIC_TABLE_STUDENTS
    );

    const updated = await studentCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          username,
          password,
          name,
          email,
          phone,
          address,
          qualification,
          team,
          confirmedfees,
          comments,
          fees1,
          fees2,
          fees3,
          fees4,
          fees5,
          allowedSkills,  // ✅ updated in DB
        },
      }
    );

    if (updated.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "No student updated" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Student updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/students error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update student" }),
      { status: 500 }
    );
  }
}

// DELETE student
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return withCorsHeaders(
        new Response(JSON.stringify({ success: false, error: "Missing id" }), {
          status: 400,
        })
      );
    }

    const db = await connectToDatabase();
    const studentCollection = db.collection(
      process.env.NEXT_PUBLIC_TABLE_STUDENTS
    );

    const result = await studentCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return withCorsHeaders(
        new Response(
          JSON.stringify({ success: false, error: "Student not found" }),
          { status: 404 }
        )
      );
    }

    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: true, message: "Student deleted" }),
        { status: 200 }
      )
    );
  } catch (err) {
    console.error("DELETE /api/students error:", err);
    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: false, error: "Failed to delete student" }),
        { status: 500 }
      )
    );
  }
}

// Ensure Node runtime
export const runtime = "nodejs";
