import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function getUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as unknown as { id: string };
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const tenancy = await prisma.tenancy.findFirst({
    where: { id, property: { userId: user.id } },
    include: {
      property: true,
      tenant: true,
      rentPayments: { orderBy: { dueDate: 'desc' } },
      rentIncreases: { orderBy: { createdAt: 'desc' } },
      notices: { orderBy: { createdAt: 'desc' } },
      documents: { orderBy: { uploadedAt: 'desc' } },
    },
  });

  if (!tenancy) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(tenancy);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const data = await request.json();

  const existing = await prisma.tenancy.findFirst({ where: { id, property: { userId: user.id } } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const tenancy = await prisma.tenancy.update({
    where: { id },
    data: {
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      rentAmount: data.rentAmount !== undefined ? Number(data.rentAmount) : undefined,
      rentFrequency: data.rentFrequency,
      paymentMethod: data.paymentMethod,
      depositAmount: data.depositAmount !== undefined ? Number(data.depositAmount) : undefined,
      depositScheme: data.depositScheme,
      depositReference: data.depositReference,
      depositProtectedDate: data.depositProtectedDate ? new Date(data.depositProtectedDate) : undefined,
      status: data.status,
      noticePeriod: data.noticePeriod !== undefined ? Number(data.noticePeriod) : undefined,
      notes: data.notes,
    },
  });

  return NextResponse.json(tenancy);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.tenancy.findFirst({ where: { id, property: { userId: user.id } } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.tenancy.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
