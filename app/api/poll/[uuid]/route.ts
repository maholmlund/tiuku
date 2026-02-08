import { NextRequest, NextResponse } from "next/server";
import Poll from "@/backend/models/Poll";
import dbConnect from "@/backend/db";
import { z } from "zod";

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/poll/[uuid]'>) {
  const { uuid } = await ctx.params;
  dbConnect();
  const poll = await Poll.findOne({ uuid }, '-_id uuid title start end responses createdAt');
  if (poll === null) {
    return new NextResponse("not found", { status: 404 });
  }
  return NextResponse.json(poll);
}

const responseSchema = z.object({
  name: z.string().min(1),
  responses: z.string().length(30)
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
    const response = responseSchema.parse(data);
    const index = poll.responses.map((r: z.infer<typeof responseSchema>) => r.name).indexOf(response.name);

    if (index === -1) {
      if (poll.responses.length >= 10) {
        return new NextResponse("too many users", { status: 400 });
      }
      poll.responses.push(response);
    } else {
      poll.responses[index] = response;
    }

    await poll.save();
    return new NextResponse();
  } catch {
    return new NextResponse("bad request", { status: 400 });
  }
}
