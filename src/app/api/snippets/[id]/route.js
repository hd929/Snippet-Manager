import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Snippet from "@/models/Snippet";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
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
    return NextResponse.json({ error: "Failed to update snippet" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();
    
    const snippet = await Snippet.findByIdAndDelete(id);
    
    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Snippet deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 });
  }
}
