import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: {
        property: true,
        tenancy: { include: { tenant: true } },
      },
    });

    if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(request);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;
    const data = await request.json();

    const updated = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        contractor: data.contractor,
        cost: data.cost ? parseFloat(data.cost) : null,
        completedDate: data.status === 'completed' ? new Date() : data.completedDate ? new Date(data.completedDate) : null,
        notes: data.notes,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getUserId();
    const { id } = await params;
    await prisma.maintenanceRequest.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
