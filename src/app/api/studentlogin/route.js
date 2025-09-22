import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return withCorsHeaders(
        new Response(
          JSON.stringify({ success: false, error: "Username and password required" }),
          { status: 400 }
        )
      );
    }

    const db = await connectToDatabase();
    const studentCollection = db.collection(process.env.NEXT_PUBLIC_TABLE_STUDENTS);

    const student = await studentCollection.findOne({ username, password });

    if (!student) {
      return withCorsHeaders(
        new Response(
          JSON.stringify({ success: false, error: "Invalid credentials" }),
          { status: 401 }
        )
      );
    }

    // pick only safe fields
    const payload = {
      name: student.name,
      email: student.email,
      phone: student.phone,
      team: student.team,
      allowedSkills: student.allowedSkills || [],
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          error: null,
          token,
        }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("API error (POST studentlogin):", error);
    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: false,
          error: "Failed to login",
        }),
        { status: 500 }
      )
    );
  }
}
