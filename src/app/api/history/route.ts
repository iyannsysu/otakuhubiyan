import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  anilistId: z.number().int().positive(),
  title: z.string().min(1).max(400),
  image: z.string().url().optional().nullable(),
  episode: z.number().int().positive(),
  episodeId: z.string().min(1).max(400),
  position: z.number().nonnegative(),
  duration: z.number().nonnegative(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const data = parsed.data;
  const item = await prisma.history.upsert({
    where: {
      userId_anilistId_episode: {
        userId: session.user.id,
        anilistId: data.anilistId,
        episode: data.episode,
      },
    },
    create: {
      userId: session.user.id,
      anilistId: data.anilistId,
      title: data.title,
      image: data.image ?? null,
      episode: data.episode,
      episodeId: data.episodeId,
      position: data.position,
      duration: data.duration,
    },
    update: {
      position: data.position,
      duration: data.duration,
      episodeId: data.episodeId,
      watchedAt: new Date(),
    },
  });
  return NextResponse.json({ item });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const list = await prisma.history.findMany({
    where: { userId: session.user.id },
    orderBy: { watchedAt: "desc" },
    take: 60,
  });
  return NextResponse.json({ items: list });
}
