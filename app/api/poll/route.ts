import { NextRequest, NextResponse } from "next/server";
import Poll from "@/lib/models/Poll";
import dbConnect from "@/lib/db";
import { z } from "zod"

export const MAX_POLL_SIZE = 4 * 1024;

const requestSchema = z.object({
  encryptedData: z.string().max(MAX_POLL_SIZE),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { encryptedData } = requestSchema.parse(data);
    const uuid = crypto.randomUUID();
    await dbConnect();
    const poll = new Poll({ uuid, encryptedData });
    await poll.save();
    const link = `${process.env.TIUKU_BASE_URL}/poll/${uuid}`
    return new NextResponse(JSON.stringify({ link }), { status: 200 });
  } catch {
    return new NextResponse("bad request", { status: 400 });
  }
}
