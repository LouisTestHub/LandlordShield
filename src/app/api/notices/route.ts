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

  const notices = await prisma.notice.findMany({
    where: { tenancy: { property: { userId: user.id } } },
    orderBy: { createdAt: 'desc' },
    include: { tenancy: { include: { property: true, tenant: true } } },
  });

  return NextResponse.json(notices);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const data = await request.json();

  const tenancy = await prisma.tenancy.findFirst({ where: { id: data.tenancyId, property: { userId: user.id } } });
  if (!tenancy) return NextResponse.json({ error: 'Tenancy not found' }, { status: 404 });

  // Calculate effective date based on notice type
  let effectiveDate = data.effectiveDate ? new Date(data.effectiveDate) : null;
  if (!effectiveDate && data.servedDate) {
    const served = new Date(data.servedDate);
    switch (data.type) {
      case 'section13':
      case 'rent_increase':
        // 2 months minimum notice under Renters' Rights Act
        effectiveDate = new Date(served);
        effectiveDate.setMonth(effectiveDate.getMonth() + 2);
        break;
      case 'section8':
        // Varies by ground, default 2 weeks for mandatory grounds
        effectiveDate = new Date(served);
        effectiveDate.setDate(effectiveDate.getDate() + 14);
        break;
      case 'intention_to_sell':
      case 'family_move_in':
        // 4 months notice under Renters' Rights Act
        effectiveDate = new Date(served);
        effectiveDate.setMonth(effectiveDate.getMonth() + 4);
        break;
    }
  }

  const notice = await prisma.notice.create({
    data: {
      tenancyId: data.tenancyId,
      type: data.type,
      servedDate: data.servedDate ? new Date(data.servedDate) : null,
      effectiveDate,
      grounds: data.grounds || null,
      status: data.status || 'draft',
      notes: data.notes || null,
    },
  });

  return NextResponse.json(notice, { status: 201 });
}
