import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function monthsAgo(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

async function main() {
  console.log('🌱 Seeding LandlordShield database...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.mortgage.deleteMany();
  await prisma.document.deleteMany();
  await prisma.insurance.deleteMany();
  await prisma.maintenanceRequest.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.rentPayment.deleteMany();
  await prisma.rentIncrease.deleteMany();
  await prisma.complianceTask.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.tenancy.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('LandlordShield2026!', 12);

  // === USERS ===
  const sarah = await prisma.user.create({
    data: { email: 'sarah@landlordshield.demo', name: 'Sarah Johnson', passwordHash, role: 'landlord' },
  });
  const james = await prisma.user.create({
    data: { email: 'james@landlordshield.demo', name: 'James Cooper', passwordHash, role: 'property_manager' },
  });
  const accountant = await prisma.user.create({
    data: { email: 'accountant@landlordshield.demo', name: 'Helen Price', passwordHash, role: 'accountant' },
  });
  console.log('✅ 3 users created');

  // === PROPERTIES ===
  const chelmsford = await prisma.property.create({
    data: {
      userId: sarah.id, address: '42 Springfield Road', postcode: 'CM1 5QR', type: 'flat',
      bedrooms: 2, bathrooms: 1, epcRating: 'C', councilTaxBand: 'C',
      purchaseDate: new Date('2019-06-15'), purchasePrice: 195000, currentValue: 235000,
      mortgageProvider: 'Nationwide', mortgageRate: 3.49, status: 'active',
    },
  });

  const colchester = await prisma.property.create({
    data: {
      userId: sarah.id, address: '17 High Street', postcode: 'CO3 3DA', type: 'house',
      bedrooms: 3, bathrooms: 2, epcRating: 'D', councilTaxBand: 'D',
      purchaseDate: new Date('2020-03-10'), purchasePrice: 275000, currentValue: 310000,
      mortgageProvider: 'Halifax', mortgageRate: 4.19, status: 'active',
    },
  });

  const southend = await prisma.property.create({
    data: {
      userId: sarah.id, address: '8 Marine Parade', postcode: 'SS1 2EJ', type: 'flat',
      bedrooms: 1, bathrooms: 1, epcRating: 'E', councilTaxBand: 'B',
      purchaseDate: new Date('2021-09-20'), purchasePrice: 145000, currentValue: 160000,
      mortgageProvider: 'Barclays', mortgageRate: 4.89, status: 'vacant',
    },
  });

  const london = await prisma.property.create({
    data: {
      userId: sarah.id, address: '156 Brick Lane', postcode: 'E1 6RU', type: 'HMO',
      bedrooms: 4, bathrooms: 2, epcRating: 'C', councilTaxBand: 'E',
      purchaseDate: new Date('2018-01-20'), purchasePrice: 450000, currentValue: 520000,
      mortgageProvider: 'NatWest', mortgageRate: 3.89, status: 'active',
      notes: 'HMO licence required - 4 bed, multi-occupancy',
    },
  });

  const cambridge = await prisma.property.create({
    data: {
      userId: sarah.id, address: '5 Mill Road', postcode: 'CB1 2AW', type: 'flat',
      bedrooms: 2, bathrooms: 1, epcRating: 'B', councilTaxBand: 'D',
      purchaseDate: new Date('2022-04-15'), purchasePrice: 320000, currentValue: 350000,
      mortgageProvider: 'HSBC', mortgageRate: 3.29, status: 'active',
    },
  });

  const ipswich = await prisma.property.create({
    data: {
      userId: sarah.id, address: '23 Woodbridge Road', postcode: 'IP1 2LR', type: 'house',
      bedrooms: 3, bathrooms: 1, epcRating: 'D', councilTaxBand: 'C',
      purchaseDate: new Date('2017-11-05'), purchasePrice: 210000, currentValue: 245000,
      mortgageProvider: 'Santander', mortgageRate: 5.09, status: 'active',
      notes: 'Multiple maintenance issues pending',
    },
  });
  console.log('✅ 6 properties created');

  // === TENANTS ===
  const tenants = await Promise.all([
    prisma.tenant.create({ data: { name: 'Michael Chen', email: 'michael.chen@email.com', phone: '07700 900201', nationality: 'British', rightToRentChecked: true, rightToRentExpiry: null, emergencyContact: 'Lisa Chen', emergencyPhone: '07700 900202' } }),
    prisma.tenant.create({ data: { name: 'Emma Watson', email: 'emma.watson@email.com', phone: '07700 900203', nationality: 'British', rightToRentChecked: true, dateOfBirth: new Date('1992-04-15') } }),
    prisma.tenant.create({ data: { name: 'Amir Hassan', email: 'amir.hassan@email.com', phone: '07700 900204', nationality: 'Jordanian', rightToRentChecked: true, rightToRentExpiry: daysFromNow(45), emergencyContact: 'Fatima Hassan', emergencyPhone: '07700 900205' } }),
    prisma.tenant.create({ data: { name: 'Sophie Taylor', email: 'sophie.taylor@email.com', phone: '07700 900206', nationality: 'British', rightToRentChecked: true, dateOfBirth: new Date('1988-09-22') } }),
    prisma.tenant.create({ data: { name: 'Raj Patel', email: 'raj.patel@email.com', phone: '07700 900207', nationality: 'British', rightToRentChecked: true } }),
    prisma.tenant.create({ data: { name: 'Anna Kowalski', email: 'anna.kowalski@email.com', phone: '07700 900208', nationality: 'Polish', rightToRentChecked: true, rightToRentExpiry: daysFromNow(180) } }),
    prisma.tenant.create({ data: { name: 'David Okonkwo', email: 'david.okonkwo@email.com', phone: '07700 900209', nationality: 'Nigerian', rightToRentChecked: false, notes: 'Right to rent check due - visa renewal pending' } }),
    prisma.tenant.create({ data: { name: 'Laura Mitchell', email: 'laura.mitchell@email.com', phone: '07700 900210', nationality: 'British', rightToRentChecked: true, dateOfBirth: new Date('1995-12-03') } }),
  ]);
  console.log('✅ 8 tenants created');

  // === TENANCIES ===
  const tenancies = await Promise.all([
    // Chelmsford - Michael Chen
    prisma.tenancy.create({ data: {
      propertyId: chelmsford.id, tenantId: tenants[0].id,
      startDate: monthsAgo(14), endDate: daysFromNow(60), rentAmount: 1100, rentFrequency: 'monthly',
      paymentMethod: 'standing_order', depositAmount: 1100, depositScheme: 'DPS',
      depositReference: 'DPS-2024-CM1-001', depositProtectedDate: monthsAgo(14), status: 'active',
    }}),
    // Colchester - Emma Watson
    prisma.tenancy.create({ data: {
      propertyId: colchester.id, tenantId: tenants[1].id,
      startDate: monthsAgo(8), endDate: daysFromNow(120), rentAmount: 1350, rentFrequency: 'monthly',
      paymentMethod: 'bank_transfer', depositAmount: 1350, depositScheme: 'TDS',
      depositReference: 'TDS-2025-CO3-001', depositProtectedDate: monthsAgo(8), status: 'active',
    }}),
    // London HMO - Amir, Sophie, Raj
    prisma.tenancy.create({ data: {
      propertyId: london.id, tenantId: tenants[2].id,
      startDate: monthsAgo(10), endDate: daysFromNow(60), rentAmount: 850, rentFrequency: 'monthly',
      paymentMethod: 'standing_order', depositAmount: 850, depositScheme: 'DPS',
      depositReference: 'DPS-2025-E1-001', depositProtectedDate: monthsAgo(10), status: 'active',
    }}),
    prisma.tenancy.create({ data: {
      propertyId: london.id, tenantId: tenants[3].id,
      startDate: monthsAgo(6), rentAmount: 850, rentFrequency: 'monthly',
      paymentMethod: 'standing_order', depositAmount: 850, depositScheme: 'DPS',
      depositReference: 'DPS-2025-E1-002', depositProtectedDate: monthsAgo(6), status: 'active',
    }}),
    prisma.tenancy.create({ data: {
      propertyId: london.id, tenantId: tenants[4].id,
      startDate: monthsAgo(3), rentAmount: 900, rentFrequency: 'monthly',
      paymentMethod: 'bank_transfer', depositAmount: 900, depositScheme: 'DPS',
      depositReference: 'DPS-2025-E1-003', depositProtectedDate: monthsAgo(3), status: 'active',
    }}),
    // Cambridge - Anna Kowalski
    prisma.tenancy.create({ data: {
      propertyId: cambridge.id, tenantId: tenants[5].id,
      startDate: monthsAgo(18), endDate: daysFromNow(30), rentAmount: 1250, rentFrequency: 'monthly',
      paymentMethod: 'direct_debit', depositAmount: 1250, depositScheme: 'MyDeposits',
      depositReference: 'MY-2024-CB1-001', depositProtectedDate: monthsAgo(18), status: 'ending',
    }}),
    // Ipswich - David Okonkwo
    prisma.tenancy.create({ data: {
      propertyId: ipswich.id, tenantId: tenants[6].id,
      startDate: monthsAgo(4), endDate: daysFromNow(240), rentAmount: 950, rentFrequency: 'monthly',
      paymentMethod: 'standing_order', depositAmount: 950, depositScheme: 'DPS',
      depositReference: 'DPS-2025-IP1-001', depositProtectedDate: monthsAgo(4), status: 'active',
    }}),
  ]);
  console.log('✅ 7 tenancies created');

  // === CERTIFICATES (20+) ===
  const certTypes = ['gas_safety', 'eicr', 'epc', 'legionella', 'smoke_co', 'fire_risk'];
  const allProperties = [chelmsford, colchester, southend, london, cambridge, ipswich];

  const certData = [
    // Chelmsford - fully compliant
    { propertyId: chelmsford.id, type: 'gas_safety', issueDate: monthsAgo(6), expiryDate: daysFromNow(180), status: 'valid', engineer: 'SafeGas Ltd', certificateNumber: 'GS-2025-001' },
    { propertyId: chelmsford.id, type: 'eicr', issueDate: monthsAgo(12), expiryDate: daysFromNow(1095), status: 'valid', engineer: 'SparksElectric', certificateNumber: 'EICR-2025-001' },
    { propertyId: chelmsford.id, type: 'epc', issueDate: monthsAgo(24), expiryDate: daysFromNow(2920), status: 'valid', certificateNumber: 'EPC-0001-2345-6789' },
    { propertyId: chelmsford.id, type: 'smoke_co', issueDate: monthsAgo(3), expiryDate: daysFromNow(270), status: 'valid', engineer: 'FireSafe Co' },
    // Colchester - gas cert expiring
    { propertyId: colchester.id, type: 'gas_safety', issueDate: monthsAgo(11), expiryDate: daysFromNow(21), status: 'expiring', engineer: 'British Gas', certificateNumber: 'GS-2025-002' },
    { propertyId: colchester.id, type: 'eicr', issueDate: monthsAgo(18), expiryDate: daysFromNow(900), status: 'valid', engineer: 'PowerCheck', certificateNumber: 'EICR-2024-002' },
    { propertyId: colchester.id, type: 'epc', issueDate: monthsAgo(36), expiryDate: daysFromNow(2190), status: 'valid', certificateNumber: 'EPC-0002-3456-7890' },
    { propertyId: colchester.id, type: 'legionella', issueDate: monthsAgo(20), expiryDate: daysFromNow(100), status: 'valid', engineer: 'WaterSafe Ltd' },
    // Southend - needs EICR
    { propertyId: southend.id, type: 'gas_safety', issueDate: monthsAgo(5), expiryDate: daysFromNow(210), status: 'valid', engineer: 'SafeGas Ltd', certificateNumber: 'GS-2025-003' },
    { propertyId: southend.id, type: 'eicr', issueDate: monthsAgo(62), expiryDate: daysAgo(30), status: 'expired', engineer: 'OldSparks', certificateNumber: 'EICR-2020-003' },
    { propertyId: southend.id, type: 'epc', issueDate: monthsAgo(48), expiryDate: daysFromNow(1825), status: 'valid', certificateNumber: 'EPC-0003-4567-8901' },
    // London HMO - fire risk due
    { propertyId: london.id, type: 'gas_safety', issueDate: monthsAgo(4), expiryDate: daysFromNow(240), status: 'valid', engineer: 'SafeGas Ltd', certificateNumber: 'GS-2025-004' },
    { propertyId: london.id, type: 'eicr', issueDate: monthsAgo(8), expiryDate: daysFromNow(1555), status: 'valid', engineer: 'SparksElectric', certificateNumber: 'EICR-2025-004' },
    { propertyId: london.id, type: 'epc', issueDate: monthsAgo(12), expiryDate: daysFromNow(3285), status: 'valid', certificateNumber: 'EPC-0004-5678-9012' },
    { propertyId: london.id, type: 'fire_risk', issueDate: monthsAgo(25), expiryDate: daysFromNow(5), status: 'expiring', engineer: 'FireRisk Assessments Ltd', certificateNumber: 'FRA-2024-001' },
    { propertyId: london.id, type: 'smoke_co', issueDate: monthsAgo(2), expiryDate: daysFromNow(300), status: 'valid', engineer: 'FireSafe Co' },
    { propertyId: london.id, type: 'legionella', issueDate: monthsAgo(10), expiryDate: daysFromNow(90), status: 'valid', engineer: 'WaterSafe Ltd' },
    // Cambridge - fully compliant
    { propertyId: cambridge.id, type: 'gas_safety', issueDate: monthsAgo(3), expiryDate: daysFromNow(270), status: 'valid', engineer: 'British Gas', certificateNumber: 'GS-2025-005' },
    { propertyId: cambridge.id, type: 'eicr', issueDate: monthsAgo(6), expiryDate: daysFromNow(1640), status: 'valid', engineer: 'CambridgeElectric', certificateNumber: 'EICR-2025-005' },
    { propertyId: cambridge.id, type: 'epc', issueDate: monthsAgo(18), expiryDate: daysFromNow(3100), status: 'valid', certificateNumber: 'EPC-0005-6789-0123' },
    // Ipswich - multiple issues
    { propertyId: ipswich.id, type: 'gas_safety', issueDate: monthsAgo(13), expiryDate: daysAgo(15), status: 'expired', engineer: 'LocalGas', certificateNumber: 'GS-2024-006' },
    { propertyId: ipswich.id, type: 'eicr', issueDate: monthsAgo(50), expiryDate: daysAgo(60), status: 'expired', engineer: 'OldSparks', certificateNumber: 'EICR-2021-006' },
    { propertyId: ipswich.id, type: 'epc', issueDate: monthsAgo(84), expiryDate: daysFromNow(365), status: 'valid', certificateNumber: 'EPC-0006-7890-1234' },
    { propertyId: ipswich.id, type: 'smoke_co', issueDate: monthsAgo(14), expiryDate: daysAgo(5), status: 'expired', engineer: 'FireSafe Co' },
  ];

  for (const cert of certData) {
    await prisma.certificate.create({ data: cert });
  }
  console.log('✅ 24 certificates created');

  // === COMPLIANCE TASKS (15+) ===
  const taskData = [
    { propertyId: colchester.id, title: 'Renew gas safety certificate', dueDate: daysFromNow(21), priority: 'high', status: 'pending', category: 'gas_safety' },
    { propertyId: southend.id, title: 'Book EICR inspection', dueDate: daysAgo(30), priority: 'high', status: 'overdue', category: 'eicr' },
    { propertyId: london.id, title: 'Fire risk assessment renewal', dueDate: daysFromNow(5), priority: 'high', status: 'pending', category: 'fire_risk' },
    { propertyId: ipswich.id, title: 'Urgent: Gas safety certificate expired', dueDate: daysAgo(15), priority: 'high', status: 'overdue', category: 'gas_safety' },
    { propertyId: ipswich.id, title: 'EICR renewal overdue', dueDate: daysAgo(60), priority: 'high', status: 'overdue', category: 'eicr' },
    { propertyId: ipswich.id, title: 'Replace smoke/CO alarms', dueDate: daysAgo(5), priority: 'high', status: 'overdue', category: 'smoke_co' },
    { propertyId: chelmsford.id, title: 'Annual boiler service', dueDate: daysFromNow(45), priority: 'medium', status: 'pending', category: 'gas_safety' },
    { propertyId: cambridge.id, title: 'Tenancy renewal discussion', dueDate: daysFromNow(20), priority: 'medium', status: 'pending', category: 'tenancy' },
    { propertyId: london.id, title: 'HMO licence renewal', dueDate: daysFromNow(90), priority: 'medium', status: 'pending', category: 'licensing' },
    { propertyId: chelmsford.id, title: 'Legionella risk assessment', dueDate: daysFromNow(60), priority: 'low', status: 'pending', category: 'legionella' },
    { propertyId: colchester.id, title: 'EPC improvement recommendations', dueDate: daysFromNow(180), priority: 'low', status: 'pending', category: 'epc' },
    // Completed tasks
    { propertyId: chelmsford.id, title: 'Gas safety certificate renewed', dueDate: daysAgo(180), priority: 'high', status: 'completed', completedDate: daysAgo(185), category: 'gas_safety' },
    { propertyId: cambridge.id, title: 'EICR inspection completed', dueDate: daysAgo(180), priority: 'high', status: 'completed', completedDate: daysAgo(182), category: 'eicr' },
    { propertyId: london.id, title: 'Smoke alarm batteries replaced', dueDate: daysAgo(60), priority: 'medium', status: 'completed', completedDate: daysAgo(62), category: 'smoke_co' },
    { propertyId: colchester.id, title: 'Legionella assessment', dueDate: daysAgo(300), priority: 'medium', status: 'completed', completedDate: daysAgo(305), category: 'legionella' },
    { propertyId: cambridge.id, title: 'Annual property inspection', dueDate: daysAgo(90), priority: 'low', status: 'completed', completedDate: daysAgo(88), category: 'inspection' },
  ];

  for (const task of taskData) {
    await prisma.complianceTask.create({ data: task });
  }
  console.log('✅ 16 compliance tasks created');

  // === RENT INCREASES ===
  await prisma.rentIncrease.create({ data: {
    tenancyId: tenancies[0].id, currentRent: 1050, proposedRent: 1100,
    increaseDate: monthsAgo(2), noticeServedDate: monthsAgo(4), method: 'section13',
    status: 'accepted', marketRentEvidence: 'Comparable flats in CM1 area: £1,050-£1,200/mo',
  }});
  await prisma.rentIncrease.create({ data: {
    tenancyId: tenancies[1].id, currentRent: 1350, proposedRent: 1450,
    increaseDate: daysFromNow(60), noticeServedDate: daysAgo(14), method: 'section13',
    status: 'proposed', marketRentEvidence: 'Market research shows £1,400-£1,500 for 3-bed in CO3',
  }});
  await prisma.rentIncrease.create({ data: {
    tenancyId: tenancies[5].id, currentRent: 1200, proposedRent: 1350,
    increaseDate: daysFromNow(30), noticeServedDate: monthsAgo(2), method: 'section13',
    status: 'tribunal', tribunalDate: daysFromNow(45),
    marketRentEvidence: 'Tenant has challenged the increase via FTT',
  }});
  console.log('✅ 3 rent increases created');

  // === RENT PAYMENTS (50+) ===
  const paymentStatuses = ['paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'late', 'missed']; // weighted

  for (const tenancy of tenancies) {
    for (let m = 0; m < 6; m++) {
      const dueDate = monthsAgo(m);
      dueDate.setDate(1);
      const statusIdx = Math.floor(Math.random() * paymentStatuses.length);
      const status = m === 0 && Math.random() > 0.7 ? 'missed' : paymentStatuses[statusIdx];
      const paidDate = status === 'paid' ? new Date(dueDate.getTime() + (Math.random() * 3) * 24 * 60 * 60 * 1000) :
                       status === 'late' ? new Date(dueDate.getTime() + (7 + Math.random() * 14) * 24 * 60 * 60 * 1000) : null;

      await prisma.rentPayment.create({
        data: {
          tenancyId: tenancy.id,
          amount: tenancy.rentAmount,
          dueDate,
          paidDate,
          method: tenancy.paymentMethod || 'bank_transfer',
          status,
          reference: status !== 'missed' ? `REF-${tenancy.id.slice(0, 4)}-${m}` : null,
        },
      });
    }
  }

  // Add a few extra specific ones for variety
  await prisma.rentPayment.create({ data: { tenancyId: tenancies[6].id, amount: 475, dueDate: monthsAgo(2), paidDate: monthsAgo(2), method: 'bank_transfer', status: 'partial', notes: 'Partial payment - agreed instalment plan' } });
  await prisma.rentPayment.create({ data: { tenancyId: tenancies[6].id, amount: 475, dueDate: daysAgo(14), method: 'bank_transfer', status: 'missed', notes: 'Second instalment missed' } });
  console.log('✅ 50+ rent payments created');

  // === NOTICES ===
  const noticeData = [
    { tenancyId: tenancies[1].id, type: 'section13', servedDate: daysAgo(14), effectiveDate: daysFromNow(60), status: 'served', notes: 'Rent increase notice' },
    { tenancyId: tenancies[5].id, type: 'section13', servedDate: monthsAgo(2), effectiveDate: daysFromNow(30), status: 'court', notes: 'Challenged - referred to FTT' },
    { tenancyId: tenancies[6].id, type: 'section8', servedDate: daysAgo(7), effectiveDate: daysFromNow(14), grounds: 'Ground 8, 10, 11 - rent arrears', status: 'served' },
    { tenancyId: tenancies[0].id, type: 'intention_to_sell', status: 'draft', notes: 'Considering selling Chelmsford flat - market assessment needed' },
    { tenancyId: tenancies[2].id, type: 'rent_increase', servedDate: monthsAgo(6), effectiveDate: monthsAgo(4), status: 'expired' },
    { tenancyId: tenancies[3].id, type: 'family_move_in', status: 'draft', notes: 'Exploring options for daughter' },
  ];

  for (const notice of noticeData) {
    await prisma.notice.create({ data: notice });
  }
  console.log('✅ 6 notices created');

  // === MAINTENANCE REQUESTS ===
  const maintenanceData = [
    { propertyId: ipswich.id, tenancyId: tenancies[6].id, title: 'Boiler not heating water', description: 'Central heating works but no hot water from taps or shower', priority: 'emergency', status: 'in_progress', contractor: 'Quick Fix Plumbing', cost: 350, reportedDate: daysAgo(3) },
    { propertyId: ipswich.id, tenancyId: tenancies[6].id, title: 'Damp in bedroom wall', description: 'Black mould appearing on external wall', priority: 'high', status: 'acknowledged', reportedDate: daysAgo(14) },
    { propertyId: colchester.id, tenancyId: tenancies[1].id, title: 'Leaking kitchen tap', description: 'Constant drip from mixer tap', priority: 'medium', status: 'reported', reportedDate: daysAgo(2) },
    { propertyId: london.id, tenancyId: tenancies[2].id, title: 'Broken window handle (Room 2)', description: 'Handle snapped off, window cannot be secured', priority: 'high', status: 'in_progress', contractor: 'London Window Repairs', cost: 120, reportedDate: daysAgo(7) },
    { propertyId: chelmsford.id, tenancyId: tenancies[0].id, title: 'Dishwasher making grinding noise', description: 'Loud grinding when running', priority: 'low', status: 'completed', contractor: 'Appliance Solutions', cost: 85, reportedDate: daysAgo(30), completedDate: daysAgo(25) },
    { propertyId: cambridge.id, tenancyId: tenancies[5].id, title: 'Garden fence blown down', description: 'Two panels blown down in storm', priority: 'medium', status: 'completed', contractor: 'FenceRight', cost: 280, reportedDate: daysAgo(45), completedDate: daysAgo(38) },
    { propertyId: london.id, tenancyId: tenancies[3].id, title: 'Extractor fan not working (bathroom)', description: 'Fan makes noise but does not extract', priority: 'medium', status: 'acknowledged', reportedDate: daysAgo(5) },
    { propertyId: ipswich.id, title: 'Roof tile missing', description: 'Visible from street - potential leak risk', priority: 'high', status: 'reported', reportedDate: daysAgo(1) },
    { propertyId: chelmsford.id, tenancyId: tenancies[0].id, title: 'Intercom buzzer broken', priority: 'low', status: 'closed', contractor: 'EntryTech', cost: 65, reportedDate: daysAgo(60), completedDate: daysAgo(52) },
    { propertyId: colchester.id, tenancyId: tenancies[1].id, title: 'Guttering overflowing', description: 'Blocked gutters causing water to run down wall', priority: 'medium', status: 'reported', reportedDate: daysAgo(4) },
  ];

  for (const m of maintenanceData) {
    await prisma.maintenanceRequest.create({ data: m });
  }
  console.log('✅ 10 maintenance requests created');

  // === INSURANCE ===
  const insuranceData = [
    { propertyId: chelmsford.id, provider: 'Aviva', policyNumber: 'AVV-2025-001', type: 'buildings', startDate: monthsAgo(6), renewalDate: daysFromNow(180), premium: 285, excess: 250 },
    { propertyId: chelmsford.id, provider: 'Aviva', policyNumber: 'AVV-2025-002', type: 'landlord', startDate: monthsAgo(6), renewalDate: daysFromNow(180), premium: 195, excess: 150 },
    { propertyId: colchester.id, provider: 'Direct Line', policyNumber: 'DL-2025-001', type: 'buildings', startDate: monthsAgo(3), renewalDate: daysFromNow(270), premium: 340, excess: 300 },
    { propertyId: london.id, provider: 'AXA', policyNumber: 'AXA-2025-001', type: 'buildings', startDate: monthsAgo(8), renewalDate: daysFromNow(120), premium: 520, excess: 500 },
    { propertyId: london.id, provider: 'AXA', policyNumber: 'AXA-2025-002', type: 'rent_guarantee', startDate: monthsAgo(8), renewalDate: daysFromNow(120), premium: 380, excess: 0, notes: 'Covers up to 12 months rent' },
    { propertyId: cambridge.id, provider: 'LV=', policyNumber: 'LV-2025-001', type: 'buildings', startDate: monthsAgo(10), renewalDate: daysFromNow(60), premium: 310, excess: 250 },
    { propertyId: ipswich.id, provider: 'Zurich', policyNumber: 'ZUR-2025-001', type: 'buildings', startDate: monthsAgo(2), renewalDate: daysFromNow(300), premium: 295, excess: 300 },
    { propertyId: ipswich.id, provider: 'Legal & General', policyNumber: 'LG-2025-001', type: 'legal', startDate: monthsAgo(1), renewalDate: daysFromNow(335), premium: 165, excess: 100, notes: 'Legal expenses cover for tenant disputes' },
  ];

  for (const ins of insuranceData) {
    await prisma.insurance.create({ data: ins });
  }
  console.log('✅ 8 insurance policies created');

  // === DOCUMENTS (20+) ===
  const documentData = [
    { propertyId: chelmsford.id, name: 'Gas Safety Certificate - Chelmsford', type: 'certificate', fileUrl: '/docs/chelmsford-gas-2025.pdf' },
    { propertyId: chelmsford.id, name: 'EICR Report - Chelmsford', type: 'certificate', fileUrl: '/docs/chelmsford-eicr-2025.pdf' },
    { propertyId: chelmsford.id, name: 'EPC Certificate - Chelmsford', type: 'certificate', fileUrl: '/docs/chelmsford-epc.pdf' },
    { propertyId: chelmsford.id, tenancyId: tenancies[0].id, name: 'Tenancy Agreement - Michael Chen', type: 'contract', fileUrl: '/docs/chelmsford-tenancy-chen.pdf' },
    { propertyId: colchester.id, name: 'Gas Safety Certificate - Colchester', type: 'certificate', fileUrl: '/docs/colchester-gas-2025.pdf' },
    { propertyId: colchester.id, name: 'EICR Report - Colchester', type: 'certificate', fileUrl: '/docs/colchester-eicr-2024.pdf' },
    { propertyId: colchester.id, tenancyId: tenancies[1].id, name: 'Tenancy Agreement - Emma Watson', type: 'contract', fileUrl: '/docs/colchester-tenancy-watson.pdf' },
    { propertyId: london.id, name: 'HMO Licence', type: 'certificate', fileUrl: '/docs/london-hmo-licence.pdf' },
    { propertyId: london.id, name: 'Fire Risk Assessment - London', type: 'certificate', fileUrl: '/docs/london-fra-2024.pdf' },
    { propertyId: london.id, name: 'Gas Safety Certificate - London', type: 'certificate', fileUrl: '/docs/london-gas-2025.pdf' },
    { propertyId: london.id, name: 'Property Photos - London HMO', type: 'photo', fileUrl: '/docs/london-photos.zip' },
    { propertyId: cambridge.id, name: 'Gas Safety Certificate - Cambridge', type: 'certificate', fileUrl: '/docs/cambridge-gas-2025.pdf' },
    { propertyId: cambridge.id, tenancyId: tenancies[5].id, name: 'Tenancy Agreement - Anna Kowalski', type: 'contract', fileUrl: '/docs/cambridge-tenancy-kowalski.pdf' },
    { propertyId: ipswich.id, name: 'Expired Gas Safety - Ipswich', type: 'certificate', fileUrl: '/docs/ipswich-gas-2024.pdf', notes: 'EXPIRED - renewal required urgently' },
    { propertyId: ipswich.id, name: 'Damp Report - Ipswich', type: 'report', fileUrl: '/docs/ipswich-damp-report.pdf' },
    { propertyId: ipswich.id, tenancyId: tenancies[6].id, name: 'Tenancy Agreement - David Okonkwo', type: 'contract', fileUrl: '/docs/ipswich-tenancy-okonkwo.pdf' },
    { name: 'Landlord Insurance Portfolio Summary', type: 'report', fileUrl: '/docs/insurance-summary-2025.pdf' },
    { name: 'Annual Tax Summary 2024-25', type: 'report', fileUrl: '/docs/tax-summary-2024-25.pdf' },
    { propertyId: southend.id, name: 'EPC Certificate - Southend', type: 'certificate', fileUrl: '/docs/southend-epc.pdf' },
    { propertyId: southend.id, name: 'Property Inventory - Southend', type: 'report', fileUrl: '/docs/southend-inventory.pdf' },
    { name: 'Repair Receipts - Q1 2025', type: 'receipt', fileUrl: '/docs/receipts-q1-2025.pdf' },
    { propertyId: colchester.id, name: 'Section 13 Notice - Colchester', type: 'letter', fileUrl: '/docs/colchester-s13-notice.pdf' },
  ];

  for (const doc of documentData) {
    await prisma.document.create({ data: doc });
  }
  console.log('✅ 22 documents created');

  // === EXPENSES (30+) ===
  const expenseCategories = [
    { category: 'repairs', descriptions: ['Boiler service', 'Plumber call-out', 'Window repair', 'Roof repair', 'Lock replacement', 'Painting hallway'] },
    { category: 'insurance', descriptions: ['Buildings insurance', 'Landlord insurance', 'Rent guarantee premium'] },
    { category: 'mortgage_interest', descriptions: ['Monthly mortgage interest'] },
    { category: 'agent_fees', descriptions: ['Letting agent fee', 'Tenant find fee'] },
    { category: 'legal', descriptions: ['Solicitor consultation', 'Section 8 notice preparation'] },
    { category: 'accounting', descriptions: ['Annual accountant fee', 'Tax return preparation'] },
    { category: 'travel', descriptions: ['Property inspection visit', 'Mileage to property'] },
    { category: 'utilities', descriptions: ['Water rates (void period)', 'Council tax (void period)'] },
    { category: 'furnishings', descriptions: ['New oven', 'Replacement carpet', 'Smoke alarms'] },
  ];

  const expenseEntries: { userId: string; propertyId?: string; category: string; description: string; amount: number; date: Date; supplier?: string }[] = [];

  for (let m = 0; m < 6; m++) {
    // Mortgage interest for all properties (monthly)
    for (const prop of allProperties) {
      if (prop.mortgageRate) {
        expenseEntries.push({
          userId: sarah.id, propertyId: prop.id, category: 'mortgage_interest',
          description: `Mortgage interest - ${prop.address.split(',')[0]}`,
          amount: Math.round((prop.purchasePrice! * (prop.mortgageRate / 100) / 12) * 100) / 100,
          date: monthsAgo(m), supplier: prop.mortgageProvider || undefined,
        });
      }
    }
  }

  // Additional expenses
  const additionalExpenses = [
    { propertyId: ipswich.id, category: 'repairs', description: 'Emergency boiler repair', amount: 350, date: daysAgo(3), supplier: 'Quick Fix Plumbing' },
    { propertyId: chelmsford.id, category: 'repairs', description: 'Dishwasher repair', amount: 85, date: daysAgo(25), supplier: 'Appliance Solutions' },
    { propertyId: cambridge.id, category: 'repairs', description: 'Garden fence replacement', amount: 280, date: daysAgo(38), supplier: 'FenceRight' },
    { propertyId: london.id, category: 'repairs', description: 'Window handle replacement', amount: 120, date: daysAgo(5), supplier: 'London Window Repairs' },
    { propertyId: chelmsford.id, category: 'repairs', description: 'Intercom repair', amount: 65, date: daysAgo(52), supplier: 'EntryTech' },
    { category: 'insurance', description: 'Portfolio buildings insurance', amount: 2490, date: monthsAgo(3), supplier: 'Various insurers' },
    { category: 'accounting', description: 'Annual accountant fee', amount: 650, date: monthsAgo(1), supplier: 'Price & Associates' },
    { category: 'legal', description: 'Section 8 notice preparation', amount: 350, date: daysAgo(10), supplier: 'Smith & Partners Solicitors' },
    { propertyId: colchester.id, category: 'agent_fees', description: 'Tenant find fee', amount: 750, date: monthsAgo(8), supplier: 'Essex Lettings' },
    { category: 'travel', description: 'Mileage to properties (quarterly)', amount: 124, date: monthsAgo(1) },
    { propertyId: southend.id, category: 'utilities', description: 'Water rates - void period', amount: 89, date: monthsAgo(1), supplier: 'Essex & Suffolk Water' },
    { propertyId: southend.id, category: 'utilities', description: 'Council tax - void period', amount: 145, date: monthsAgo(1), supplier: 'Southend Council' },
    { propertyId: london.id, category: 'furnishings', description: 'Replacement smoke alarms x4', amount: 120, date: monthsAgo(2), supplier: 'Screwfix' },
    { propertyId: ipswich.id, category: 'furnishings', description: 'New oven', amount: 399, date: monthsAgo(3), supplier: 'Currys' },
  ];

  for (const exp of additionalExpenses) {
    expenseEntries.push({ userId: sarah.id, ...exp });
  }

  for (const exp of expenseEntries) {
    await prisma.expense.create({ data: exp });
  }
  console.log(`✅ ${expenseEntries.length} expenses created`);

  // === MORTGAGES ===
  const mortgageData = [
    { propertyId: chelmsford.id, provider: 'Nationwide', type: 'fixed', interestRate: 3.49, monthlyPayment: 780, outstandingBalance: 155000, startDate: monthsAgo(24), endDate: daysFromNow(365) },
    { propertyId: colchester.id, provider: 'Halifax', type: 'fixed', interestRate: 4.19, monthlyPayment: 1050, outstandingBalance: 220000, startDate: monthsAgo(18), endDate: daysFromNow(540) },
    { propertyId: southend.id, provider: 'Barclays', type: 'variable', interestRate: 4.89, monthlyPayment: 620, outstandingBalance: 118000, startDate: monthsAgo(12), endDate: daysFromNow(730) },
    { propertyId: london.id, provider: 'NatWest', type: 'fixed', interestRate: 3.89, monthlyPayment: 1650, outstandingBalance: 350000, startDate: monthsAgo(30), endDate: daysFromNow(90), notes: 'Deal ending soon - remortgage needed' },
    { propertyId: cambridge.id, provider: 'HSBC', type: 'fixed', interestRate: 3.29, monthlyPayment: 920, outstandingBalance: 256000, startDate: monthsAgo(20), endDate: daysFromNow(460) },
    { propertyId: ipswich.id, provider: 'Santander', type: 'tracker', interestRate: 5.09, monthlyPayment: 780, outstandingBalance: 145000, startDate: monthsAgo(6), endDate: daysFromNow(900) },
  ];

  for (const mort of mortgageData) {
    await prisma.mortgage.create({ data: mort });
  }
  console.log('✅ 6 mortgages created');

  // === NOTIFICATIONS ===
  const notificationData = [
    { userId: sarah.id, title: 'Gas certificate expiring', message: 'Gas safety certificate for 17 High Street, CO3 expires in 21 days', type: 'warning', actionUrl: '/dashboard/certificates' },
    { userId: sarah.id, title: 'Fire risk assessment due', message: 'Fire risk assessment for 156 Brick Lane, E1 expires in 5 days', type: 'urgent', actionUrl: '/dashboard/certificates' },
    { userId: sarah.id, title: 'EICR expired', message: 'EICR for 8 Marine Parade, SS1 has expired - renew immediately', type: 'danger', actionUrl: '/dashboard/certificates' },
    { userId: sarah.id, title: 'Gas safety expired - Ipswich', message: 'Gas safety certificate for 23 Woodbridge Road, IP1 expired 15 days ago', type: 'danger', actionUrl: '/dashboard/certificates' },
    { userId: sarah.id, title: 'Rent payment missed', message: 'David Okonkwo has missed this month\'s rent payment for Ipswich property', type: 'warning', actionUrl: '/dashboard/rent/payments' },
    { userId: sarah.id, title: 'Maintenance request (emergency)', message: 'Boiler not heating water at 23 Woodbridge Road, IP1', type: 'urgent', actionUrl: '/dashboard/maintenance' },
    { userId: sarah.id, title: 'Insurance renewal reminder', message: 'Cambridge buildings insurance (LV=) renews in 60 days', type: 'info', actionUrl: '/dashboard/insurance' },
    { userId: sarah.id, title: 'Tenancy ending soon', message: 'Anna Kowalski\'s tenancy at 5 Mill Road, CB1 ends in 30 days', type: 'warning', actionUrl: '/dashboard/tenancies' },
    { userId: sarah.id, title: 'NatWest mortgage deal ending', message: 'Your NatWest fixed rate deal ends in 90 days - consider remortgaging', type: 'info', actionUrl: '/dashboard/finance/mortgages' },
    { userId: sarah.id, title: 'Tribunal date set', message: 'FTT hearing for Cambridge rent increase set for next month', type: 'info', actionUrl: '/dashboard/rent/increases' },
    { userId: sarah.id, title: 'Section 8 notice served', message: 'Section 8 notice served to David Okonkwo for rent arrears', type: 'info', actionUrl: '/dashboard/notices' },
    { userId: sarah.id, title: 'Right to rent check due', message: 'David Okonkwo\'s right to rent check needs completing', type: 'warning', actionUrl: '/dashboard/tenants' },
    { userId: sarah.id, title: 'MTD quarterly deadline approaching', message: 'Q4 (Jan-Mar) submission deadline is 5 May', type: 'info', actionUrl: '/dashboard/finance/tax' },
    { userId: sarah.id, title: 'Smoke/CO alarms expired - Ipswich', message: 'Smoke/CO alarm certification expired at 23 Woodbridge Road', type: 'danger' },
    { userId: sarah.id, title: 'New maintenance request', message: 'Roof tile missing at 23 Woodbridge Road, IP1', type: 'warning', actionUrl: '/dashboard/maintenance' },
  ];

  for (const notif of notificationData) {
    await prisma.notification.create({ data: notif });
  }
  console.log('✅ 15 notifications created');

  // === AUDIT LOG ===
  const auditData = [
    { userId: sarah.id, action: 'Created', entity: 'Property', entityId: chelmsford.id, details: '42 Springfield Road, CM1 5QR' },
    { userId: sarah.id, action: 'Created', entity: 'Tenancy', entityId: tenancies[0].id, details: 'Michael Chen at Chelmsford flat' },
    { userId: sarah.id, action: 'Uploaded', entity: 'Certificate', entityId: chelmsford.id, details: 'Gas safety certificate' },
    { userId: sarah.id, action: 'Created', entity: 'Property', entityId: london.id, details: '156 Brick Lane, E1 6RU (HMO)' },
    { userId: sarah.id, action: 'Served', entity: 'Notice', entityId: tenancies[6].id, details: 'Section 8 notice - rent arrears' },
    { userId: sarah.id, action: 'Logged', entity: 'Maintenance', entityId: ipswich.id, details: 'Emergency boiler repair' },
    { userId: sarah.id, action: 'Recorded', entity: 'Expense', entityId: ipswich.id, details: 'Boiler repair - £350' },
    { userId: sarah.id, action: 'Updated', entity: 'Certificate', entityId: london.id, details: 'Fire risk assessment expiring soon' },
    { userId: sarah.id, action: 'Created', entity: 'Insurance', entityId: london.id, details: 'AXA rent guarantee policy' },
    { userId: sarah.id, action: 'Proposed', entity: 'Rent Increase', entityId: tenancies[1].id, details: '£1,350 → £1,450 for Colchester' },
    { userId: sarah.id, action: 'Completed', entity: 'Maintenance', entityId: chelmsford.id, details: 'Dishwasher repair - £85' },
    { userId: sarah.id, action: 'Added', entity: 'Tenant', entityId: tenants[6].id, details: 'David Okonkwo' },
    { userId: sarah.id, action: 'Renewed', entity: 'Certificate', entityId: cambridge.id, details: 'EICR inspection completed' },
    { userId: sarah.id, action: 'Updated', entity: 'Property', entityId: ipswich.id, details: 'Added notes about maintenance issues' },
    { userId: sarah.id, action: 'Created', entity: 'Mortgage', entityId: london.id, details: 'NatWest fixed rate - deal ending soon' },
    { userId: sarah.id, action: 'Recorded', entity: 'Payment', entityId: tenancies[0].id, details: 'March rent received - £1,100' },
    { userId: sarah.id, action: 'Uploaded', entity: 'Document', entityId: ipswich.id, details: 'Damp report' },
    { userId: sarah.id, action: 'Updated', entity: 'Tenancy', entityId: tenancies[5].id, details: 'Status changed to ending - 30 days remaining' },
    { userId: sarah.id, action: 'Created', entity: 'Task', entityId: colchester.id, details: 'Gas safety renewal task' },
    { userId: sarah.id, action: 'Exported', entity: 'Report', entityId: sarah.id, details: 'Portfolio overview report generated' },
  ];

  for (let i = 0; i < auditData.length; i++) {
    await prisma.auditLog.create({
      data: {
        ...auditData[i],
        createdAt: daysAgo(i * 2 + Math.floor(Math.random() * 3)),
      },
    });
  }
  console.log('✅ 20 audit log entries created');

  console.log('\n🎉 Seed complete! Demo accounts:');
  console.log('  sarah@landlordshield.demo / LandlordShield2026! (Landlord — 6 properties)');
  console.log('  james@landlordshield.demo / LandlordShield2026! (Property Manager)');
  console.log('  accountant@landlordshield.demo / LandlordShield2026! (Accountant)');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
