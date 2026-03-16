import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function getUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as unknown as { id: string };
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const tenancies = await prisma.tenancy.findMany({
    where: { property: { userId: user.id } },
    orderBy: { startDate: 'desc' },
    include: { property: true, tenant: true },
  });

  return NextResponse.json(tenancies);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const data = await request.json();

  // Verify property belongs to user
  const property = await prisma.property.findFirst({ where: { id: data.propertyId, userId: user.id } });
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  const tenancy = await prisma.tenancy.create({
    data: {
      propertyId: data.propertyId,
      tenantId: data.tenantId,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      rentAmount: Number(data.rentAmount),
      rentFrequency: data.rentFrequency || 'monthly',
      paymentMethod: data.paymentMethod || null,
      depositAmount: data.depositAmount ? Number(data.depositAmount) : null,
      depositScheme: data.depositScheme || null,
      depositReference: data.depositReference || null,
      depositProtectedDate: data.depositProtectedDate ? new Date(data.depositProtectedDate) : null,
      status: data.status || 'active',
      noticePeriod: data.noticePeriod ? Number(data.noticePeriod) : null,
      notes: data.notes || null,
    },
  });

  return NextResponse.json(tenancy, { status: 201 });
}
