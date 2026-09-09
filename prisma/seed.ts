import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Master Accounts ---
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ZEYAD_PASSWORD || 'Sirad@Admin2024';
  const zeyadPassword = process.env.ZEYAD_PASSWORD || 'Sirad@Tech2024';
  const yehiaPassword = process.env.YEHIA_PASSWORD || 'Sirad@Marketing2024';

  const adminHash = await hash(adminPassword, 12);
  const zeyadHash = await hash(zeyadPassword, 12);
  const yehiaHash = await hash(yehiaPassword, 12);

  // 1. Primary Unified Admin Account
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@sirad.com' },
  });
  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: { email: 'admin@sirad.com', passwordHash: adminHash, name: 'Admin', role: 'ADMIN' },
    });
  } else {
    await prisma.user.create({
      data: { name: 'Admin', email: 'admin@sirad.com', passwordHash: adminHash, role: 'ADMIN' },
    });
  }

  // 2. Zeyad Account (also granted ADMIN so existing credentials have full dual-department switching)
  const existingZeyad = await prisma.user.findFirst({
    where: { OR: [{ email: 'zeyad@sirad.com' }, { email: 'zeyad@sirad.tech' }] },
  });
  if (existingZeyad) {
    await prisma.user.update({
      where: { id: existingZeyad.id },
      data: { email: 'zeyad@sirad.com', passwordHash: zeyadHash, name: 'Zeyad', role: 'ADMIN' },
    });
  } else {
    await prisma.user.create({
      data: { name: 'Zeyad', email: 'zeyad@sirad.com', passwordHash: zeyadHash, role: 'ADMIN' },
    });
  }

  // 3. Yehia Account (also granted ADMIN for full flexibility)
  const existingYehia = await prisma.user.findFirst({
    where: { OR: [{ email: 'yehia@sirad.com' }, { email: 'yehia@sirad.tech' }] },
  });
  if (existingYehia) {
    await prisma.user.update({
      where: { id: existingYehia.id },
      data: { email: 'yehia@sirad.com', passwordHash: yehiaHash, name: 'Yehia', role: 'ADMIN' },
    });
  } else {
    await prisma.user.create({
      data: { name: 'Yehia', email: 'yehia@sirad.com', passwordHash: yehiaHash, role: 'ADMIN' },
    });
  }

  // Clean up any remaining legacy .tech records
  await prisma.user.deleteMany({
    where: { email: { in: ['zeyad@sirad.tech', 'yehia@sirad.tech'] } },
  });

  console.log('✅ Seeded master admin accounts');
  console.log('   → Primary Admin: admin@sirad.com (Role: ADMIN)');
  console.log('   → Zeyad: zeyad@sirad.com (Role: ADMIN)');
  console.log('   → Yehia: yehia@sirad.com (Role: ADMIN)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
