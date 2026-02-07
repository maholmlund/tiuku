import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import Poll from "@/backend/models/Poll";
import dbConnect from "@/backend/db";
import { z } from "zod"

const requestSchema = z.object({
  title: z.string().min(1),
  start: z.string(),
  end: z.string(),
});

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
  const data = await req.json();
  const { title, start, end } = requestSchema.parse(data);
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
