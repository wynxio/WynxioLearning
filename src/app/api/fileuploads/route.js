import { withCorsHeaders } from "@/app/lib/cors";
import connectToDatabase from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

// Directory for uploads
const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// GET all files with pagination
export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const fileCollection = db.collection(process.env.NEXT_PUBLIC_GENERAL_FILES);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const total = await fileCollection.countDocuments();
    const files = await fileCollection.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Attach full URL
    const data = files.map(f => ({
      ...f,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${f.fileName}`
    }));

    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: true, data, total, page, limit }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("API error (GET files):", error);
    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: false, error: "Failed to fetch files" }),
        { status: 500 }
      )
    );
  }
}

// DELETE file by ID
export async function DELETE(req) {
  try {
    const db = await connectToDatabase();
    const fileCollection = db.collection(process.env.NEXT_PUBLIC_GENERAL_FILES);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return withCorsHeaders(
        new Response(
          JSON.stringify({ success: false, error: "Missing file id" }),
          { status: 400 }
        )
      );
    }

    const fileDoc = await fileCollection.findOne({ _id: new ObjectId(id) });
    if (!fileDoc) {
      return withCorsHeaders(
        new Response(
          JSON.stringify({ success: false, error: "File not found" }),
          { status: 404 }
        )
      );
    }

    // Delete from disk
    const filePath = path.join(uploadDir, fileDoc.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from DB
    await fileCollection.deleteOne({ _id: new ObjectId(id) });

    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: true, id }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("API error (DELETE file):", error);
    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: false, error: "Error deleting file" }),
        { status: 500 }
      )
    );
  }
}


 // POST new file (image or video)
export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const fileCollection = db.collection(process.env.NEXT_PUBLIC_GENERAL_FILES);

    const formData = await req.formData();
    const file = formData.get("file"); // uploaded file

    if (!file) {
      return withCorsHeaders(
        new Response(
          JSON.stringify({ success: false, error: "Missing file" }),
          { status: 400 }
        )
      );
    }

    // Detect extension
    const originalName = file.name || "upload";
    let ext = path.extname(originalName).toLowerCase();
    if (!ext && file.type.startsWith("image/")) {
      ext = ".jpg";
    }

    // Generate unique name
    const randomName = randomUUID() + ext;
    const filePath = path.join(uploadDir, randomName);

    // Convert image → JPG, otherwise save as-is
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (file.type.startsWith("image/")) {
      const jpgBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
      fs.writeFileSync(filePath, jpgBuffer);
    } else {
      fs.writeFileSync(filePath, buffer);
    }

    // Save record in DB
    await fileCollection.insertOne({
      fileName: randomName,
      mimeType: file.type,
      createdAt: new Date(),
    });

    return withCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          fileName: randomName, // return filename to frontend
        }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("API error (POST file):", error);
    return withCorsHeaders(
      new Response(
        JSON.stringify({ success: false, error: "Error saving file" }),
        { status: 500 }
      )
    );
  }
}
