import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function getUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as unknown as { id: string };
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const increases = await prisma.rentIncrease.findMany({
    where: { tenancy: { property: { userId: user.id } } },
    orderBy: { createdAt: 'desc' },
    include: { tenancy: { include: { property: true, tenant: true } } },
  });

  return NextResponse.json(increases);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const data = await request.json();

  const tenancy = await prisma.tenancy.findFirst({ where: { id: data.tenancyId, property: { userId: user.id } } });
  if (!tenancy) return NextResponse.json({ error: 'Tenancy not found' }, { status: 404 });

  const increase = await prisma.rentIncrease.create({
    data: {
      tenancyId: data.tenancyId,
      currentRent: Number(data.currentRent),
      proposedRent: Number(data.proposedRent),
      increaseDate: new Date(data.increaseDate),
      noticeServedDate: data.noticeServedDate ? new Date(data.noticeServedDate) : null,
      method: data.method || 'section13',
      marketRentEvidence: data.marketRentEvidence || null,
      status: data.status || 'proposed',
      tribunalDate: data.tribunalDate ? new Date(data.tribunalDate) : null,
      tribunalOutcome: data.tribunalOutcome || null,
      notes: data.notes || null,
    },
  });

  return NextResponse.json(increase, { status: 201 });
}
