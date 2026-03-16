import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function getUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as unknown as { id: string; email: string; role: string };
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const properties = await prisma.property.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { certificates: true, tenancies: true } } },
  });

  return NextResponse.json(properties);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const data = await request.json();

  const property = await prisma.property.create({
    data: {
      userId: user.id,
      address: data.address,
      postcode: data.postcode,
      type: data.type || 'house',
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      epcRating: data.epcRating || null,
      councilTaxBand: data.councilTaxBand || null,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
      purchasePrice: data.purchasePrice || null,
      currentValue: data.currentValue || null,
      mortgageProvider: data.mortgageProvider || null,
      mortgageRate: data.mortgageRate || null,
      status: data.status || 'active',
      notes: data.notes || null,
    },
  });

  return NextResponse.json(property, { status: 201 });
}
