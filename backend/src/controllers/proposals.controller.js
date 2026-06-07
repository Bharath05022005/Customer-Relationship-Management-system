

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProposals = async (req, res) => {
  try {
    const userRole = req.user?.roleName;
    const userEmail = req.user?.roleName === 'Salesman' ? (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email : null;

    let proposals;
    if (userRole === 'Admin') {
      proposals = await prisma.quotations.findMany({ orderBy: { createdAt: 'desc' } });
    } else {
      proposals = await prisma.quotations.findMany({
        where: { assignedTo: userEmail || '' },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
};

export const createProposal = async (req, res) => {
  try {
    const { clientName, email, item, price, quantity, assignedTo } = req.body;

    const userEmail = req.user?.roleName === 'Salesman' ? (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email : assignedTo;

    const proposal = await prisma.quotations.create({
      data: {
        clientName,
        email,
        item,
        price,
        quantity: parseInt(String(quantity), 10),
        assignedTo: userEmail || 'unassigned',
        createdAt: new Date()
      }
    });

    res.status(201).json(proposal);
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
};