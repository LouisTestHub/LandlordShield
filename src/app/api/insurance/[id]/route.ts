import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;

    const policy = await prisma.insurance.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!policy) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(policy);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;
    const data = await request.json();

    const policy = await prisma.insurance.update({
      where: { id },
      data: {
        provider: data.provider,
        policyNumber: data.policyNumber,
        type: data.type,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        renewalDate: data.renewalDate ? new Date(data.renewalDate) : undefined,
        premium: data.premium ? parseFloat(data.premium) : null,
        excess: data.excess ? parseFloat(data.excess) : null,
        notes: data.notes,
      },
    });

    return NextResponse.json(policy);
  } catch {
    return NextResponse.json({ error: 'Failed to update policy' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;
    await prisma.insurance.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete policy' }, { status: 500 });
  }
}
