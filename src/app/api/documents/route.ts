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

    const documents = await prisma.document.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      include: { property: { select: { address: true, postcode: true } }, tenancy: { select: { id: true, tenant: { select: { name: true } } } } },
    });

    return NextResponse.json(documents);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const data = await request.json();

    // Verify property belongs to user
    if (data.propertyId) {
      const property = await prisma.property.findFirst({ where: { id: data.propertyId, userId } });
      if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const document = await prisma.document.create({
      data: {
        name: data.name,
        type: data.type || 'certificate',
        fileUrl: data.fileUrl || '/uploads/placeholder.pdf',
        propertyId: data.propertyId || null,
        tenancyId: data.tenancyId || null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
