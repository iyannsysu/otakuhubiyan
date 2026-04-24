import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  anilistId: z.number().int().positive(),
  title: z.string().min(1).max(400),
  image: z.string().url().optional().nullable(),
  status: z
    .enum(["PLANNING", "WATCHING", "COMPLETED", "PAUSED", "DROPPED"])
    .optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const anilistId = Number(searchParams.get("anilistId"));
  if (anilistId) {
    const found = await prisma.watchlist.findUnique({
      where: {
        userId_anilistId: {
          userId: session.user.id,
          anilistId,
        },
      },
    });
    return NextResponse.json({ exists: !!found, item: found ?? null });
  }
  const list = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ items: list });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { anilistId, title, image, status } = parsed.data;
  const item = await prisma.watchlist.upsert({
    where: {
      userId_anilistId: { userId: session.user.id, anilistId },
    },
    create: {
      userId: session.user.id,
      anilistId,
      title,
      image: image ?? null,
      status: status ?? "PLANNING",
    },
    update: {
      title,
      image: image ?? null,
      status: status ?? undefined,
    },
  });
  return NextResponse.json({ item });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const anilistId = Number(searchParams.get("anilistId"));
  if (!anilistId) {
    return NextResponse.json({ error: "Missing anilistId" }, { status: 400 });
  }
  await prisma.watchlist
    .delete({
      where: {
        userId_anilistId: { userId: session.user.id, anilistId },
      },
    })
    .catch(() => void 0);
  return NextResponse.json({ ok: true });
}
