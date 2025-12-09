import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";

export async function POST(req: NextRequest) {
  try {
    const { title, start, end } = await readRequest(req);
    console.log("got request: ", title, start, end);
  } catch {
    return new NextResponse("bad request", { status: 400 });
  }
  // save to db
  const link = "http://localhost:3000/poll/8510f1be-e909-454a-9998-ff497daae3d1"
  return new NextResponse(JSON.stringify({ link }), { status: 200 });
}

async function readRequest(req: NextRequest) {
  const { title, start, end } = await req.json();
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  if (!title || !startDate.isValid() || !endDate.isValid()) {
    throw (1);
  }
  if (startDate.add(30, "day") < endDate || endDate < startDate) {
    throw (1);
  }
  if (title.length > 100) {
    throw (1);
  }
  return {
    title,
    start,
    end
  };
}
