import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSegments = async (req: Request, res: Response): Promise<void> => {
  try {
    const segments = await prisma.customerSegments.findMany();
    res.json(segments);
  } catch (error) {
    console.error('Error fetching segments:', error);
    res.status(500).json({ error: 'Failed to fetch segments' });
  }
};

export const createSegment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, region, industry, interest, dealSize } = req.body;

    const segment = await prisma.customerSegments.create({
      data: {
        name,
        region,
        industry,
        interest,
        dealSize
      }
    });

    res.status(201).json(segment);
  } catch (error) {
    console.error('Error creating segment:', error);
    res.status(500).json({ error: 'Failed to create segment' });
  }
};
