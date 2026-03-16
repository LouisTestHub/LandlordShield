import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const propertyId = searchParams.get('propertyId');

    const where: Record<string, unknown> = { userId };
    if (category) where.category = category;
    if (propertyId) where.propertyId = propertyId;

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { property: { select: { address: true, postcode: true } } },
    });

    return NextResponse.json(expenses);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const data = await request.json();

    const expense = await prisma.expense.create({
      data: {
        userId,
        propertyId: data.propertyId || null,
        category: data.category,
        description: data.description,
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        receiptUrl: data.receiptUrl || null,
        supplier: data.supplier || null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
