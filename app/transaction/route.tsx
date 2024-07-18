"use server";

import { ObjectId } from "mongodb";
import connectToDatabase from "../util/connect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const [year, month] = searchParams.get("date")?.split("-").map(Number) ?? [];
  if (!year || !month) {
    return NextResponse.json(
      { error: "Please provide year and month" },
      { status: 400 }
    );
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  try {
    const client = await connectToDatabase();
    const db = client.db("Dev");
    const collection = db.collection("transactions");

    const data = await collection
      .find({
        updatedAt: {
          $gte: startDate,
          $lt: endDate,
        },
      })
      .toArray();

    return NextResponse.json({ message: data });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body) {
    return NextResponse.json({ error: "Please provide data" }, { status: 400 });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("Dev");
    const collection = db.collection("transactions");

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "Document inserted", result });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();

  if (!body) {
    return NextResponse.json({ error: "Please provide data" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Please provide id" }, { status: 400 });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("Dev");
    const collection = db.collection("transactions");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ message: "Document updated", result });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Please provide id" }, { status: 400 });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("Dev");
    const collection = db.collection("transactions");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: "Documents deleted",
      count: result.deletedCount,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
