import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // Create the Admin User only — NO demo data
  const adminEmail = 'admin@vaaltic.com';
  const existingAdmin = await prisma.salesman.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    await prisma.salesman.create({
      data: {
        username: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        Role: 'Admin'
      }
    });
    console.log('✅ Admin user created: admin@vaaltic.com / Admin123!');
  } else {
    console.log('ℹ️  Admin user already exists.');
  }

  console.log('✅ Seeding complete. Dashboard will show real data as you add leads, deals, and tasks.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
