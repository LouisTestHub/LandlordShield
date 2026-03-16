import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const properties = await prisma.property.findMany({ where: { userId }, select: { id: true } });
    const propertyIds = properties.map(p => p.id);

    const where: Record<string, unknown> = { propertyId: { in: propertyIds } };
    if (propertyId) where.propertyId = propertyId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const requests = await prisma.maintenanceRequest.findMany({
      where,
      orderBy: { reportedDate: 'desc' },
      include: {
        property: { select: { address: true, postcode: true } },
        tenancy: { select: { tenant: { select: { name: true } } } },
      },
    });

    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch maintenance requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const data = await request.json();

    const property = await prisma.property.findFirst({ where: { id: data.propertyId, userId } });
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    const maintenanceRequest = await prisma.maintenanceRequest.create({
      data: {
        propertyId: data.propertyId,
        tenancyId: data.tenancyId || null,
        title: data.title,
        description: data.description || null,
        priority: data.priority || 'medium',
        status: 'reported',
        contractor: data.contractor || null,
        cost: data.cost ? parseFloat(data.cost) : null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(maintenanceRequest, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create maintenance request' }, { status: 500 });
  }
}
