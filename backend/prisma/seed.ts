import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // Create the First Admin User in Salesman table
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
    console.log('Created the first Admin User: admin@vaaltic.com');
  } else {
    console.log('Admin user already exists.');
  }

  console.log('Seeding Completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
