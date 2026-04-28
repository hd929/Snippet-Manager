import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Snippet from "@/models/Snippet";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const favorites = searchParams.get("favorites") === "true";

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (favorites) {
      filter.isFavorite = true;
    }

    const snippets = await Snippet.find(filter).sort({ isFavorite: -1, createdAt: -1 });

    return NextResponse.json(snippets, { status: 200 });
  } catch (error) {
    console.error("GET /api/snippets error:", error);
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Input validation
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body.code || !body.code.trim()) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }
    if (body.title.length > 100) {
      return NextResponse.json({ error: "Title cannot exceed 100 characters" }, { status: 400 });
    }
    if (body.code.length > 50000) {
      return NextResponse.json({ error: "Code cannot exceed 50000 characters" }, { status: 400 });
    }

    await connectToDatabase();
    const snippet = await Snippet.create({
      title: body.title.trim(),
      code: body.code,
      notes: body.notes?.trim() || "",
      timeComplexity: body.timeComplexity?.trim() || "O(1)",
      tags: Array.isArray(body.tags) ? body.tags.map(t => t.trim()).filter(Boolean) : [],
      category: body.category || "Other",
      isFavorite: body.isFavorite || false,
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    console.error("POST /api/snippets error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(e => e.message);
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 });
  }
}
