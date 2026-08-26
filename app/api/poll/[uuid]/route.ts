import { NextRequest, NextResponse } from "next/server";
import Poll from "@/lib/models/Poll";
import dbConnect from "@/lib/db";
import { z } from "zod";
import { MAX_POLL_SIZE } from "../route";

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/poll/[uuid]'>) {
  const { uuid } = await ctx.params;
  dbConnect();
  const poll = await Poll.findOne({ uuid }, '-_id uuid encryptedData createdAt');
  if (poll === null) {
    return new NextResponse("not found", { status: 404 });
  }
  return NextResponse.json(poll);
}

const requestSchema = z.object({
  sha256: z.string().length(64),
  newData: z.string().max(MAX_POLL_SIZE),
});

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/poll/[uuid]'>) {
  const { uuid } = await ctx.params;
  dbConnect();
  const poll = await Poll.findOne({ uuid });
  if (poll === null) {
    return new NextResponse("not found", { status: 404 });
  }
  try {
    const data = await req.json();
    const response = requestSchema.parse(data);
    const sha256 = crypto.subtle.digest("SHA-256", Buffer.from(poll.encryptedData, "base64"));
    if (response.sha256 !== Buffer.from(await sha256).toHex()) {
      return new NextResponse("invalid hash", { status: 409 });
    }
    poll.encryptedData = response.newData;
    await poll.save();
    return new NextResponse();
  } catch {
    return new NextResponse("bad request", { status: 400 });
  }
}
