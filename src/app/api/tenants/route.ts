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

  const tenants = await prisma.tenant.findMany({
    orderBy: { name: 'asc' },
    include: { tenancies: { include: { property: true }, orderBy: { startDate: 'desc' } } },
  });

  return NextResponse.json(tenants);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const data = await request.json();

  const tenant = await prisma.tenant.create({
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      nationality: data.nationality || null,
      rightToRentChecked: data.rightToRentChecked || false,
      rightToRentExpiry: data.rightToRentExpiry ? new Date(data.rightToRentExpiry) : null,
      emergencyContact: data.emergencyContact || null,
      emergencyPhone: data.emergencyPhone || null,
      notes: data.notes || null,
    },
  });

  return NextResponse.json(tenant, { status: 201 });
}
