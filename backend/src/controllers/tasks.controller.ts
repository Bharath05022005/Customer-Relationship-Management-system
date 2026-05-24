import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.roleName?.toLowerCase();
    const userEmail = userRole === 'salesman' ? (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email : null;

    let tasks;
    if (userRole === 'admin') {
      tasks = await prisma.followUps.findMany({ orderBy: { dueDate: 'asc' } });
    } else {
      tasks = await prisma.followUps.findMany({
        where: { assignedTo: userEmail || '' },
        orderBy: { dueDate: 'asc' },
      });
    }

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, type, description, dueDate, contactId, assignedTo } = req.body;

    const userRole = req.user?.roleName?.toLowerCase();
    const userEmail = userRole === 'salesman' ? (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email : assignedTo;

    const task = await prisma.followUps.create({
      data: {
        title,
        type: type || 'Call',
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        contactId: contactId ? parseInt(contactId) : null,
        assignedTo: userEmail || 'unassigned',
        status: 'Pending'
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const task = await prisma.followUps.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};
