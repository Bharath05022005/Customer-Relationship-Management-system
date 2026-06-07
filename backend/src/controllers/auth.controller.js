

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    const existingUser = await prisma.salesman.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.salesman.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
        Role: 'Salesman'
      }
    });

    res.status(201).json({ message: 'Salesman registered successfully', userId: user.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    let user = await prisma.salesman.findUnique({
      where: { email }
    });

    if (!user) {
      // Auto-register any new account on the fly for seamless testing/access
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.salesman.create({
        data: {
          username: email.split('@')[0], // Use email prefix as username
          email,
          password: hashedPassword,
          Role: 'Salesman'
        }
      });
    } else {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
    }

    const token = jwt.sign({ userId: user.id, role: user.Role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.Role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.salesman.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        Role: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};