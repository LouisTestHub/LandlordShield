import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function getUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as unknown as { id: string };
}

// Auto-calculate expiry based on cert type
function calculateExpiry(type: string, issueDate: Date): Date {
  const expiry = new Date(issueDate);
  switch (type) {
    case 'gas_safety': expiry.setFullYear(expiry.getFullYear() + 1); break;
    case 'eicr': expiry.setFullYear(expiry.getFullYear() + 5); break;
    case 'epc': expiry.setFullYear(expiry.getFullYear() + 10); break;
    case 'legionella': expiry.setFullYear(expiry.getFullYear() + 2); break;
    case 'fire_risk': expiry.setFullYear(expiry.getFullYear() + 1); break;
    case 'smoke_co': expiry.setFullYear(expiry.getFullYear() + 1); break;
    case 'pat': expiry.setFullYear(expiry.getFullYear() + 1); break;
    case 'asbestos': expiry.setFullYear(expiry.getFullYear() + 1); break;
    default: expiry.setFullYear(expiry.getFullYear() + 1);
  }
  return expiry;
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const certificates = await prisma.certificate.findMany({
    where: { property: { userId: user.id } },
    orderBy: { expiryDate: 'asc' },
    include: { property: { select: { id: true, address: true, postcode: true } } },
  });

  return NextResponse.json(certificates);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const data = await request.json();

  // Verify property belongs to user
  const property = await prisma.property.findFirst({ where: { id: data.propertyId, userId: user.id } });
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  const issueDate = new Date(data.issueDate);
  const expiryDate = data.expiryDate ? new Date(data.expiryDate) : calculateExpiry(data.type, issueDate);

  // Determine status
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  let status = 'valid';
  if (expiryDate < now) status = 'expired';
  else if (expiryDate <= thirtyDays) status = 'expiring';

  const certificate = await prisma.certificate.create({
    data: {
      propertyId: data.propertyId,
      type: data.type,
      issueDate,
      expiryDate,
      certificateNumber: data.certificateNumber || null,
      engineer: data.engineer || null,
      engineerGasRegNo: data.engineerGasRegNo || null,
      documentUrl: data.documentUrl || null,
      status,
      notes: data.notes || null,
    },
  });

  // Auto-create compliance task for upcoming expiry
  if (status !== 'expired') {
    const reminderDate = new Date(expiryDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    await prisma.complianceTask.create({
      data: {
        propertyId: data.propertyId,
        certificateId: certificate.id,
        title: `Renew ${data.type.replace(/_/g, ' ')} certificate`,
        description: `Certificate expires on ${expiryDate.toLocaleDateString('en-GB')}. Arrange renewal.`,
        dueDate: reminderDate,
        priority: 'high',
        status: 'pending',
        category: 'certificate_renewal',
        reminderDays: 30,
      },
    });
  }

  return NextResponse.json(certificate, { status: 201 });
}
