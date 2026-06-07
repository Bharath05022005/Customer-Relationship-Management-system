

import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || !text) {
      res.status(400).json({ error: 'To, subject, and text are required.' });
      return;
    }

    const info = await transporter.sendMail({
      from: `"VAALTIC CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text
    });

    // Automatically log this action in ActivityLog
    const userEmail = req.user?.roleName === 'Salesman' ? (await prisma.salesman.findUnique({ where: { id: req.user.userId } }))?.email : 'Admin';

    await prisma.activityLog.create({
      data: {
        type: 'Email',
        subject: `Sent Email: ${subject}`,
        description: `Sent to ${to}. Content: ${text.substring(0, 50)}...`,
        relatedTo: userEmail || 'unassigned',
        dateTime: new Date()
      }
    });

    res.status(200).json({ message: 'Email sent successfully!', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};