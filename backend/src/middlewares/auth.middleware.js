
import jwt from 'jsonwebtoken';
import prisma from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';









export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.salesman.findUnique({ where: { id: decoded.userId } });

    req.user = {
      userId: decoded.userId,
      roleId: 0, // No longer used, but kept for interface
      roleName: user?.Role || decoded.role
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.roleName !== 'Admin') {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
    return;
  }
  next();
};