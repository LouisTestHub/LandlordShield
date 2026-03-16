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
  const property = await prisma.property.findFirst({
    where: { id, userId: user.id },
    include: {
      tenancies: { include: { tenant: true, rentPayments: { orderBy: { dueDate: 'desc' }, take: 5 } } },
      certificates: { orderBy: { expiryDate: 'asc' } },
      maintenance: { orderBy: { reportedDate: 'desc' }, take: 10 },
      insurance: true,
      documents: { orderBy: { uploadedAt: 'desc' } },
    },
  });

  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const data = await request.json();

  const existing = await prisma.property.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const property = await prisma.property.update({
    where: { id },
    data: {
      address: data.address ?? existing.address,
      postcode: data.postcode ?? existing.postcode,
      type: data.type ?? existing.type,
      bedrooms: data.bedrooms ?? existing.bedrooms,
      bathrooms: data.bathrooms ?? existing.bathrooms,
      epcRating: data.epcRating !== undefined ? data.epcRating : existing.epcRating,
      councilTaxBand: data.councilTaxBand !== undefined ? data.councilTaxBand : existing.councilTaxBand,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : existing.purchaseDate,
      purchasePrice: data.purchasePrice !== undefined ? data.purchasePrice : existing.purchasePrice,
      currentValue: data.currentValue !== undefined ? data.currentValue : existing.currentValue,
      mortgageProvider: data.mortgageProvider !== undefined ? data.mortgageProvider : existing.mortgageProvider,
      mortgageRate: data.mortgageRate !== undefined ? data.mortgageRate : existing.mortgageRate,
      status: data.status ?? existing.status,
      notes: data.notes !== undefined ? data.notes : existing.notes,
    },
  });

  return NextResponse.json(property);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.property.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.property.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
