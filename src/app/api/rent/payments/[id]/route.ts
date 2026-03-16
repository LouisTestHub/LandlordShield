import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function getUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as unknown as { id: string };
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const data = await request.json();

  const existing = await prisma.rentPayment.findFirst({ where: { id, tenancy: { property: { userId: user.id } } } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const payment = await prisma.rentPayment.update({
    where: { id },
    data: {
      amount: data.amount !== undefined ? Number(data.amount) : undefined,
      paidDate: data.paidDate ? new Date(data.paidDate) : data.paidDate === null ? null : undefined,
      status: data.status,
      method: data.method,
      reference: data.reference,
      notes: data.notes,
    },
  });

  return NextResponse.json(payment);
}
