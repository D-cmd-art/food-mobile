import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { filename } = await params;
  console.log("filename hreeeeeeeeeeeeeeeeeeeeeeeeeee",filename)
  const filePath = path.join(process.cwd(), "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();

  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
    },
  });
}