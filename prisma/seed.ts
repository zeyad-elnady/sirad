import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Master Accounts ---
  const zeyadPassword = process.env.ZEYAD_PASSWORD || 'Sirad@Tech2024';
  const yehiaPassword = process.env.YEHIA_PASSWORD || 'Sirad@Marketing2024';

  const zeyadHash = await hash(zeyadPassword, 12);
  const yehiaHash = await hash(yehiaPassword, 12);

  const existingZeyad = await prisma.user.findFirst({
    where: { OR: [{ email: 'zeyad@sirad.com' }, { email: 'zeyad@sirad.tech' }] },
  });
  if (existingZeyad) {
    await prisma.user.update({
      where: { id: existingZeyad.id },
      data: { email: 'zeyad@sirad.com', passwordHash: zeyadHash, name: 'Zeyad', role: 'ZEYAD_TECH' },
    });
  } else {
    await prisma.user.create({
      data: { name: 'Zeyad', email: 'zeyad@sirad.com', passwordHash: zeyadHash, role: 'ZEYAD_TECH' },
    });
  }

  const existingYehia = await prisma.user.findFirst({
    where: { OR: [{ email: 'yehia@sirad.com' }, { email: 'yehia@sirad.tech' }] },
  });
  if (existingYehia) {
    await prisma.user.update({
      where: { id: existingYehia.id },
      data: { email: 'yehia@sirad.com', passwordHash: yehiaHash, name: 'Yehia', role: 'YEHIA_MARKETING' },
    });
  } else {
    await prisma.user.create({
      data: { name: 'Yehia', email: 'yehia@sirad.com', passwordHash: yehiaHash, role: 'YEHIA_MARKETING' },
    });
  }

  // Clean up any remaining legacy .tech records
  await prisma.user.deleteMany({
    where: { email: { in: ['zeyad@sirad.tech', 'yehia@sirad.tech'] } },
  });

  console.log('✅ Seeded 2 master accounts');
  console.log('   → Zeyad (Tech Lead): zeyad@sirad.com');
  console.log('   → Yehia (Marketing Lead): yehia@sirad.com');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
