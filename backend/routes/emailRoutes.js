import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const router = express.Router();
const upload = multer(); // Use memory storage for attachments

// Email sending route
router.post('/send', upload.single('attachment'), async (req, res) => {
  const { to, subject, text, html } = req.body;
  const file = req.file;

  // Validate recipient
  if (!to) {
    return res.status(400).json({ 
      success: false, 
      message: 'No recipient defined. Please provide a "to" email address.' 
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"VAALTIC CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    // If a file was uploaded, attach it to the email
    if (file) {
      mailOptions.attachments = [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Email sent successfully!',
      info,
    });
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    res.status(500).json({
      message: 'Failed to send email',
      error: error.message,
    });
  }
});

export default router;
