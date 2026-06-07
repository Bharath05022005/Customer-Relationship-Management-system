

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDeals = async (req, res) => {
  try {
    const userRole = req.user?.roleName;
    const userEmail = req.user?.roleName === 'Salesman' ? (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email : null;

    let deals;
    if (userRole === 'Admin') {
      deals = await prisma.deals.findMany({ orderBy: { expectedCloseDate: 'asc' } });
    } else {
      deals = await prisma.deals.findMany({
        where: { assignedTo: userEmail || '' },
        orderBy: { expectedCloseDate: 'asc' }
      });
    }

    res.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
};

export const createDeal = async (req, res) => {
  try {
    const {
      dealName, value, stage, expectedCloseDate,
      contactName, company, assignedTo, probability, description
    } = req.body;

    const userEmail = req.user?.roleName === 'Salesman' ?
    (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email :
    assignedTo;

    const deal = await prisma.deals.create({
      data: {
        dealName,
        value: parseInt(String(value), 10),
        stage: stage || 'Prospect',
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        contactName: contactName || null,
        company: company || null,
        assignedTo: userEmail || 'unassigned',
        probability: probability ? parseInt(String(probability), 10) : null,
        description: description || null
      }
    });

    res.status(201).json(deal);
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
};

export const updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const deal = await prisma.deals.update({
      where: { id: parseInt(String(id), 10) },
      data: updateData
    });

    res.json(deal);
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ error: 'Failed to update deal' });
  }
};