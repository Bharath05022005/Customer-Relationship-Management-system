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

  // Create Sample Leads for Dashboard Charts
  const leadsCount = await prisma.leads.count();
  if (leadsCount === 0) {
    console.log('Creating sample leads for charts...');
    await prisma.leads.createMany({
      data: [
        { name: 'John Doe', email: 'john@example.com', status: 'New', source: 'Website', value: 15000, company: 'Tech Corp' },
        { name: 'Jane Smith', email: 'jane@example.com', status: 'Contacted', source: 'Referral', value: 25000, company: 'Innovate LLC' },
        { name: 'Mike Johnson', email: 'mike@example.com', status: 'Qualified', source: 'LinkedIn', value: 45000, company: 'Global Solutions' },
        { name: 'Sarah Williams', email: 'sarah@example.com', status: 'Proposal Sent', source: 'Cold Call', value: 10000, company: 'Design Pro' },
        { name: 'David Brown', email: 'david@example.com', status: 'New', source: 'Website', value: 5000, company: 'Local Shop' }
      ]
    });
    console.log('Sample leads created.');
  } else {
    console.log('Leads already exist.');
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
