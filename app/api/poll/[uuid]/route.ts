import { NextRequest, NextResponse } from "next/server";
import Poll from "@/backend/models/Poll";
import dbConnect from "@/backend/db";

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/poll/[uuid]'>) {
  const uuid = (await ctx.params).uuid;
  dbConnect();
  const poll = await Poll.findOne({ uuid }, '-_id uuid title start end responses createdAt');
  if (poll === null) {
    return new NextResponse("not found", { status: 404 });
  }
  return NextResponse.json(poll);
}
