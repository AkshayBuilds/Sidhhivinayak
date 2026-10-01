import express from 'express';
import { transporter } from '../config/mail.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      brand,
      model,
      payment_type,
      down_payment,
      tenure,
      exchange_vehicle,
      old_vehicle_details,
    } = req.body;

    if (!name || !email || !brand || !model) {
      return res.status(400).json({
        status: 'error',
        detail: 'Name, email, brand, and model are required.',
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'amsp604@gmail.com';

    // 1. Email to Admin
    const adminMail = {
      from: `"Siddhivinayak Website" <${process.env.MAIL_FROM || 'amsp604@gmail.com'}>`,
      to: adminEmail,
      subject: `New Quotation Request from ${name} - ${brand} ${model}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
          <h2 style="color: #2563eb;">New Quotation Request</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px; font-weight: bold; width: 150px;">Customer Name:</td><td style="padding: 8px;">${name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Selected Brand:</td><td style="padding: 8px;">${brand}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Selected Model:</td><td style="padding: 8px;">${model}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Payment Type:</td><td style="padding: 8px;">${payment_type || 'Cash/Self'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Down Payment:</td><td style="padding: 8px;">₹${down_payment || 0}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Loan Tenure:</td><td style="padding: 8px;">${tenure || 0} months</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Exchange Vehicle:</td><td style="padding: 8px;">${exchange_vehicle || 'No'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Old Vehicle Details:</td><td style="padding: 8px;">${old_vehicle_details || 'N/A'}</td></tr>
          </table>
        </div>
      `,
    };

    // 2. Auto-reply to Customer
    const customerMail = {
      from: `"Siddhivinayak Auto World" <${process.env.MAIL_FROM || 'amsp604@gmail.com'}>`,
      to: email,
      subject: `Your Quotation Request for ${brand} ${model} - Siddhivinayak Auto World`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h3 style="color: #2563eb; margin-top: 0;">Dear ${name},</h3>
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for requesting a quotation for <strong>${brand} ${model}</strong> from <strong>Siddhivinayak Auto World</strong>.
          </p>
          <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #1e3a8a; margin: 16px 0;">
            <p style="margin: 0 0 6px;"><strong>Vehicle:</strong> ${brand} ${model}</p>
            <p style="margin: 0 0 6px;"><strong>Payment Mode:</strong> ${payment_type || 'Cash'}</p>
            <p style="margin: 0;">Our sales representative will connect with you shortly with the best on-road pricing, festive discounts, and fast approval loan options.</p>
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
      message: 'Quotation request sent successfully',
    });
  } catch (error) {
    console.error('Error in /api/quotation:', error);
    return res.status(500).json({
      status: 'error',
      detail: error.message || 'Failed to submit quotation request.',
    });
  }
});

export default router;
