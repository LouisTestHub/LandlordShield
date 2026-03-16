import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const type = searchParams.get('type');

    const properties = await prisma.property.findMany({ where: { userId }, select: { id: true } });
    const propertyIds = properties.map(p => p.id);

    const where: Record<string, unknown> = { propertyId: { in: propertyIds } };
    if (propertyId) where.propertyId = propertyId;
    if (type) where.type = type;

    const policies = await prisma.insurance.findMany({
      where,
      orderBy: { renewalDate: 'asc' },
      include: { property: { select: { address: true, postcode: true } } },
    });

    return NextResponse.json(policies);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch insurance policies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const data = await request.json();

    const property = await prisma.property.findFirst({ where: { id: data.propertyId, userId } });
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    const policy = await prisma.insurance.create({
      data: {
        propertyId: data.propertyId,
        provider: data.provider,
        policyNumber: data.policyNumber || null,
        type: data.type,
        startDate: new Date(data.startDate),
        renewalDate: new Date(data.renewalDate),
        premium: data.premium ? parseFloat(data.premium) : null,
        excess: data.excess ? parseFloat(data.excess) : null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(policy, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create insurance policy' }, { status: 500 });
  }
}
