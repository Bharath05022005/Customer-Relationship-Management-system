import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clear() {
  console.log('Clearing tasks...');
  await prisma.followUps.deleteMany();

  console.log('Clearing deals...');
  await prisma.deals.deleteMany();

  console.log('Clearing leads...');
  await prisma.leads.deleteMany();

  console.log('Clearing salesmen (keeping Admin)...');
  await prisma.salesman.deleteMany({
    where: {
      Role: {
        not: 'Admin'
      }
    }
  });

  console.log('All test/demo data successfully cleared!');
}

clear().
catch(console.error).
finally(async () => {
  await prisma.$disconnect();
});