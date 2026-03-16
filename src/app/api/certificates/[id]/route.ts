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
  const certificate = await prisma.certificate.findFirst({
    where: { id, property: { userId: user.id } },
    include: { property: true, complianceTasks: true },
  });

  if (!certificate) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(certificate);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const data = await request.json();

  const existing = await prisma.certificate.findFirst({ where: { id, property: { userId: user.id } } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const certificate = await prisma.certificate.update({
    where: { id },
    data: {
      issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      certificateNumber: data.certificateNumber,
      engineer: data.engineer,
      engineerGasRegNo: data.engineerGasRegNo,
      documentUrl: data.documentUrl,
      status: data.status,
      notes: data.notes,
    },
  });

  return NextResponse.json(certificate);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.certificate.findFirst({ where: { id, property: { userId: user.id } } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.certificate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
