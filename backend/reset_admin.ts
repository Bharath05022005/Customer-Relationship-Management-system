import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function resetAdmin() {
  const hash = await bcrypt.hash('Admin123!', 10);
  await prisma.salesman.updateMany({ 
    where: { Role: 'Admin' }, 
    data: { email: 'admin@vaaltic.com', password: hash } 
  });
  console.log('Admin reset complete');
}

resetAdmin().catch(console.error).finally(async () => {
  await prisma.$disconnect();
});
