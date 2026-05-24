import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getActivityLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.roleName;
    const userEmail = req.user?.roleName === 'Salesman' ? (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email : null;

    let logs;
    if (userRole === 'Admin') {
      logs = await prisma.activityLog.findMany({ orderBy: { dateTime: 'desc' } });
    } else {
      logs = await prisma.activityLog.findMany({
        where: { relatedTo: userEmail || '' },
        orderBy: { dateTime: 'desc' },
      });
    }

    res.json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
};

export const createActivityLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, subject, description, relatedTo } = req.body;

    const userEmail = req.user?.roleName === 'Salesman' ? (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email : relatedTo;

    const log = await prisma.activityLog.create({
      data: {
        type,
        subject,
        description,
        relatedTo: userEmail || 'unassigned',
        dateTime: new Date(),
      }
    });

    res.status(201).json(log);
  } catch (error) {
    console.error('Error creating activity log:', error);
    res.status(500).json({ error: 'Failed to create activity log' });
  }
};
