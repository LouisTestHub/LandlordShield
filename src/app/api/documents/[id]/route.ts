import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const properties = await prisma.property.findMany({ where: { userId }, select: { id: true } });
    const propertyIds = properties.map(p => p.id);

    const document = await prisma.document.findFirst({
      where: { id, propertyId: { in: propertyIds } },
      include: { property: true, tenancy: { include: { tenant: true } } },
    });

    if (!document) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(document);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;
    const data = await request.json();

    const document = await prisma.document.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        notes: data.notes,
      },
    });

    return NextResponse.json(document);
  } catch {
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;
    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
