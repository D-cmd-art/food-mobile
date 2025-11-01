import { NextResponse } from "next/server";
import withDB from "@/lib/server/withDB";
import Category from "@/models/Category";
import { handleUpload } from "@/lib/server/handleUpload";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadHandler(req) {
  const { fields, imageUrls } = await handleUpload(req);

  const title = fields.title?.[0];
  if (!title || imageUrls.length === 0) {
    return NextResponse.json({ error: "Missing title or photos" }, { status: 400 });
  }

  const isCategory = await Category.find({ name: title });
  if (isCategory.length > 0) {
    return NextResponse.json({ error: "Category name should not be same" }, { status: 400 });
  }

  const category = await Category.create({
    name: title,
    photos: imageUrls,
  });

  if (!category) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({
    message: "Upload successful",
    title,
    imageUrls,
  });
}

export const POST = withDB(uploadHandler);