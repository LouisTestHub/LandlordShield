import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;
    const data = await request.json();

    const mortgage = await prisma.mortgage.update({
      where: { id },
      data: {
        provider: data.provider,
        accountNumber: data.accountNumber,
        type: data.type,
        interestRate: data.interestRate ? parseFloat(data.interestRate) : undefined,
        monthlyPayment: data.monthlyPayment ? parseFloat(data.monthlyPayment) : undefined,
        outstandingBalance: data.outstandingBalance ? parseFloat(data.outstandingBalance) : null,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        notes: data.notes,
      },
    });

    return NextResponse.json(mortgage);
  } catch {
    return NextResponse.json({ error: 'Failed to update mortgage' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;
    await prisma.mortgage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete mortgage' }, { status: 500 });
  }
}
