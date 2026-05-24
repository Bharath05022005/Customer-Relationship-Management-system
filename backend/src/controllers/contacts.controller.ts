import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.roleName;
    const userEmail = req.user?.roleName === 'Salesman' ? (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email : null;

    let contacts;
    if (userRole === 'Admin') {
      contacts = await prisma.contacts.findMany({ orderBy: { createdAt: 'desc' } });
    } else {
      contacts = await prisma.contacts.findMany({
        where: { assignedTo: userEmail || '' },
        orderBy: { createdAt: 'desc' },
      });
    }

    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name, email, phone, company, notes, assignedTo,
      title, department, secondaryEmail, mobile, website, leadSource
    } = req.body;

    const userEmail = req.user?.roleName === 'Salesman'
      ? (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email
      : assignedTo;

    const contact = await prisma.contacts.create({
      data: {
        name,
        email,
        phone:          phone          || null,
        company:        company        || null,
        notes:          notes          || null,
        assignedTo:     userEmail      || 'unassigned',
        createdAt:      new Date(),
        title:          title          || null,
        department:     department     || null,
        secondaryEmail: secondaryEmail || null,
        mobile:         mobile         || null,
        website:        website        || null,
        leadSource:     leadSource     || null,
      }
    });

    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
};
