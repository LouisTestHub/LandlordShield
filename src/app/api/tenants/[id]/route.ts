import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function getUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as unknown as { id: string };
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: { tenancies: { include: { property: true }, orderBy: { startDate: 'desc' } } },
  });

  if (!tenant) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(tenant);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const data = await request.json();

  const tenant = await prisma.tenant.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      nationality: data.nationality,
      rightToRentChecked: data.rightToRentChecked,
      rightToRentExpiry: data.rightToRentExpiry ? new Date(data.rightToRentExpiry) : undefined,
      emergencyContact: data.emergencyContact,
      emergencyPhone: data.emergencyPhone,
      notes: data.notes,
    },
  });

  return NextResponse.json(tenant);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  await prisma.tenant.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
