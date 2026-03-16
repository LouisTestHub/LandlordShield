import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export async function GET() {
  try {
    const userId = await getUserId();
    const properties = await prisma.property.findMany({ where: { userId }, select: { id: true } });
    const propertyIds = properties.map(p => p.id);

    const mortgages = await prisma.mortgage.findMany({
      where: { propertyId: { in: propertyIds } },
      orderBy: { endDate: 'asc' },
      include: { property: { select: { address: true, postcode: true } } },
    });

    return NextResponse.json(mortgages);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch mortgages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const data = await request.json();

    const property = await prisma.property.findFirst({ where: { id: data.propertyId, userId } });
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    const mortgage = await prisma.mortgage.create({
      data: {
        propertyId: data.propertyId,
        provider: data.provider,
        accountNumber: data.accountNumber || null,
        type: data.type || 'fixed',
        interestRate: parseFloat(data.interestRate),
        monthlyPayment: parseFloat(data.monthlyPayment),
        outstandingBalance: data.outstandingBalance ? parseFloat(data.outstandingBalance) : null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        notes: data.notes || null,
      },
    });

    return NextResponse.json(mortgage, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create mortgage' }, { status: 500 });
  }
}
