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

  const payments = await prisma.rentPayment.findMany({
    where: { tenancy: { property: { userId: user.id } } },
    orderBy: { dueDate: 'desc' },
    include: { tenancy: { include: { property: true, tenant: true } } },
  });

  return NextResponse.json(payments);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const data = await request.json();

  const tenancy = await prisma.tenancy.findFirst({ where: { id: data.tenancyId, property: { userId: user.id } } });
  if (!tenancy) return NextResponse.json({ error: 'Tenancy not found' }, { status: 404 });

  const payment = await prisma.rentPayment.create({
    data: {
      tenancyId: data.tenancyId,
      amount: Number(data.amount),
      dueDate: new Date(data.dueDate),
      paidDate: data.paidDate ? new Date(data.paidDate) : null,
      method: data.method || null,
      reference: data.reference || null,
      status: data.status || 'paid',
      notes: data.notes || null,
    },
  });

  return NextResponse.json(payment, { status: 201 });
}
