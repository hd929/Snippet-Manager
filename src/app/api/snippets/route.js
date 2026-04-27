import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Snippet from "@/models/Snippet";

export async function GET() {
  try {
    await connectToDatabase();
    const snippets = await Snippet.find({}).sort({ createdAt: -1 });
    return NextResponse.json(snippets, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const snippet = await Snippet.create(body);
    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 });
  }
}
