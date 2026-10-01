import express from 'express';
import { transporter } from '../config/mail.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and email are required.',
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'amsp604@gmail.com';

    // 1. Email to Admin
    const adminMail = {
      from: `"Siddhivinayak Website" <${process.env.MAIL_FROM || 'amsp604@gmail.com'}>`,
      to: adminEmail,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px;">${name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">${message || 'N/A'}</td></tr>
          </table>
        </div>
      `,
    };

    // 2. Auto-reply to Customer
    const customerMail = {
      from: `"Siddhivinayak Auto World" <${process.env.MAIL_FROM || 'amsp604@gmail.com'}>`,
      to: email,
      subject: `Thank you for contacting Siddhivinayak Auto World`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h3 style="color: #2563eb; margin-top: 0;">Dear ${name},</h3>
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for contacting <strong>Siddhivinayak Auto World</strong>. We have received your inquiry and our team will get back to you shortly.
          </p>
          <div style="background: #f9fafb; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #6b7280; margin: 16px 0;">
            <strong>Your Message:</strong><br/>
            ${message || 'No additional notes provided.'}
          </div>
          <p style="font-size: 13px; color: #4b5563;">Warm regards,<br/><strong>Siddhivinayak Auto World Team</strong></p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMail).catch(err => console.warn('Admin mail failed:', err.message)),
      transporter.sendMail(customerMail).catch(err => console.warn('Customer mail failed:', err.message)),
    ]);

    return res.status(200).json({
      status: 'success',
      message: 'Contact email processed successfully.',
    });
  } catch (error) {
    console.error('Error in /api/contact:', error);
    return res.status(500).json({
      status: 'error',
      detail: error.message || 'Failed to submit contact form.',
    });
  }
});

export default router;
