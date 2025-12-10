import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import Poll from "@/backend/models/Poll";
import dbConnect from "@/backend/db";

export async function POST(req: NextRequest) {
  try {
    const { title, start, end } = await readRequest(req);
    const uuid = crypto.randomUUID();
    await dbConnect();
    const poll = new Poll({ title, start, end, uuid });
    poll.save();
    const link = `http://localhost:3000/poll/${uuid}`
    return new NextResponse(JSON.stringify({ link }), { status: 200 });
  } catch {
    return new NextResponse("bad request", { status: 400 });
  }
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
