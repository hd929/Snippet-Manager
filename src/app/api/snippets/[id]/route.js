import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Snippet from "@/models/Snippet";
import mongoose from "mongoose";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid snippet ID" }, { status: 400 });
    }

    await connectToDatabase();
    const snippet = await Snippet.findById(id);

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    return NextResponse.json(snippet, { status: 200 });
  } catch (error) {
    console.error("GET /api/snippets/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch snippet" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid snippet ID" }, { status: 400 });
    }

    const body = await request.json();
    await connectToDatabase();

    const snippet = await Snippet.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    return NextResponse.json(snippet, { status: 200 });
  } catch (error) {
    console.error("PUT /api/snippets/[id] error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(e => e.message);
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update snippet" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid snippet ID" }, { status: 400 });
    }

    await connectToDatabase();
    const snippet = await Snippet.findByIdAndDelete(id);

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Snippet deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/snippets/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 });
  }
}
