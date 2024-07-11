"use server";

import connectToDatabase from "../util/connect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const client = await connectToDatabase();
  const db = client.db("FungiFunds");

  const collection = db.collection("history"); // 컬렉션 이름 입력

  const data = await collection.find({}).toArray();

  return NextResponse.json({ message: data });
}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}
