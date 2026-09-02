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

  await prisma.user.upsert({
    where: { email: 'zeyad@sirad.tech' },
    update: {},
    create: {
      name: 'Zeyad',
      email: 'zeyad@sirad.tech',
      passwordHash: zeyadHash,
      role: 'ZEYAD_TECH',
    },
  });

  await prisma.user.upsert({
    where: { email: 'yehia@sirad.tech' },
    update: {},
    create: {
      name: 'Yehia',
      email: 'yehia@sirad.tech',
      passwordHash: yehiaHash,
      role: 'YEHIA_MARKETING',
    },
  });

  console.log('✅ Seeded 2 master accounts');
  console.log('   → Zeyad (Tech Lead): zeyad@sirad.tech');
  console.log('   → Yehia (Marketing Lead): yehia@sirad.tech');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
