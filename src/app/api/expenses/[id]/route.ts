import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;
    const data = await request.json();

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        category: data.category,
        description: data.description,
        amount: data.amount ? parseFloat(data.amount) : undefined,
        date: data.date ? new Date(data.date) : undefined,
        propertyId: data.propertyId || null,
        receiptUrl: data.receiptUrl,
        supplier: data.supplier,
        notes: data.notes,
      },
    });

    return NextResponse.json(expense);
  } catch {
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;
    await prisma.expense.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
