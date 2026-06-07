

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all leads (Admins see all, Salesmen see assigned)
export const getLeads = async (req, res) => {
  try {
    const userRole = req.user?.roleName?.toLowerCase();
    const userEmail = userRole === 'salesman' ? (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email : null;

    let leads;
    if (userRole === 'admin') {
      leads = await prisma.leads.findMany({ orderBy: { createdAt: 'desc' } });
    } else {
      leads = await prisma.leads.findMany({
        where: { assignedTo: userEmail || '' },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

// Create a new lead
export const createLead = async (req, res) => {
  try {
    const {
      name, email, phone, company, status, source, value, assignedTo,
      title, website, industry, noOfEmployees, annualRevenue, rating, description
    } = req.body;

    const userRole = req.user?.roleName?.toLowerCase();
    const userEmail = userRole === 'salesman' ?
    (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email :
    assignedTo;

    const lead = await prisma.leads.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        status: status || 'New',
        source: source || 'Manual',
        assignedTo: userEmail || 'unassigned',
        value: value || 0,
        createdAt: new Date(),
        lastContact: new Date(),
        title: title || null,
        website: website || null,
        industry: industry || null,
        noOfEmployees: noOfEmployees || null,
        annualRevenue: annualRevenue || null,
        rating: rating || null,
        description: description || null
      }
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

// Update a lead (e.g., status change)
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const lead = await prisma.leads.update({
      where: { id: parseInt(String(id), 10) },
      data: updateData
    });

    res.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
};