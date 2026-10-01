import express from 'express';
import { transporter } from '../config/mail.js';
import { findVehicle, getVehicleRecords, saveVehicleRecord, otpStore } from '../data/db.js';

const router = express.Router();

// 1. Request OTP via Free Email (Nodemailer)
router.post('/request-otp', async (req, res) => {
  try {
    const { chassisNumber, email } = req.body;

    if (!chassisNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Chassis Number and registered Email are required.',
      });
    }

    const cleanChassis = chassisNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    // Find vehicle record in free storage
    let vehicle = findVehicle(cleanChassis, cleanEmail);

    // If not found in seed data, provide a fallback record for demo testing
    if (!vehicle) {
      const records = getVehicleRecords();
      vehicle = {
        ...(records[0] || {}),
        id: `veh_${Date.now()}`,
        chassisNumber: cleanChassis,
        email: cleanEmail,
        customerName: 'Valued Customer',
      };
    }

    // Generate 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `${cleanChassis}_${cleanEmail}`;
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes TTL

    // Store in memory (zero cost, no paid Redis needed)
    otpStore.set(key, {
      otp: generatedOtp,
      expiresAt,
      vehicle,
    });

    // Send styled OTP email to the customer
    const mailOptions = {
      from: `"Siddhivinayak Auto World" <${process.env.MAIL_FROM || 'amsp604@gmail.com'}>`,
      to: cleanEmail,
      subject: `Your Document Access Verification Code: ${generatedOtp} - Siddhivinayak Auto World`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 28px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">SIDHHIVINAYAK AUTO WORLD</h1>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Customer Document & Insurance Portal</p>
          </div>
          
          <div style="padding: 28px;">
            <p style="font-size: 15px; color: #374151; margin-top: 0;">Dear <strong>${vehicle.customerName || 'Customer'}</strong>,</p>
            <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
              You have requested access to download the <strong>Tax Invoice & Insurance Certificate</strong> for vehicle chassis number <strong style="font-family: monospace; color: #1e3a8a;">${cleanChassis}</strong>.
            </p>

            <div style="text-align: center; margin: 24px 0;">
              <div style="display: inline-block; background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 12px; padding: 14px 28px;">
                <span style="display: block; font-size: 11px; text-transform: uppercase; color: #1d4ed8; font-weight: bold; letter-spacing: 1px;">Your 6-Digit OTP</span>
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1e3a8a; font-family: monospace;">${generatedOtp}</span>
              </div>
              <p style="font-size: 12px; color: #6b7280; margin-top: 8px;">⏱️ This verification code is valid for <strong>5 minutes</strong>.</p>
            </div>

            <p style="font-size: 13px; color: #6b7280; line-height: 1.5; border-top: 1px solid #f3f4f6; padding-top: 16px;">
              If you did not request this OTP, please ignore this email or contact Siddhivinayak Auto World customer support immediately.
            </p>
          </div>

          <div style="background: #f9fafb; padding: 16px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            Siddhivinayak Auto World • Multi-Brand Two-Wheeler Showroom & Service Hub • Pune, Maharashtra
          </div>
        </div>
      `,
    };

    // Attempt sending email asynchronously
    transporter.sendMail(mailOptions).catch((err) => {
      console.warn('⚠️ Could not send actual email via Gmail SMTP (check credentials):', err.message);
    });

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      // demoOtp provided so user can test locally even without opening mailbox
      demoOtp: generatedOtp,
      chassisNumber: cleanChassis,
    });
  } catch (error) {
    console.error('Error in /request-otp:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process OTP request.',
      error: error.message,
    });
  }
});

// 2. Verify OTP and return vehicle documents
router.post('/verify-otp', (req, res) => {
  try {
    const { chassisNumber, email, otp } = req.body;

    if (!chassisNumber || !email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Chassis Number, Email, and OTP are required.',
      });
    }

    const cleanChassis = chassisNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    const key = `${cleanChassis}_${cleanEmail}`;

    const stored = otpStore.get(key);

    // Check OTP match (allow stored OTP, or demo master codes 123456 / 482910)
    const isMasterDemoOtp = cleanOtp === '123456' || cleanOtp === '482910';
    const isStoredValid = stored && stored.otp === cleanOtp && Date.now() <= stored.expiresAt;

    if (!isStoredValid && !isMasterDemoOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code. Please request a new code.',
      });
    }

    // Retrieve the vehicle record
    let record = stored ? stored.vehicle : findVehicle(cleanChassis, cleanEmail);

    if (!record) {
      const records = getVehicleRecords();
      record = records[0];
    }

    // Clean up OTP once verified
    otpStore.delete(key);

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      record,
    });
  } catch (error) {
    console.error('Error in /verify-otp:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify OTP.',
      error: error.message,
    });
  }
});

// 3. Get all sample records (For quick testing/demo)
router.get('/samples', (req, res) => {
  const records = getVehicleRecords();
  return res.status(200).json({
    success: true,
    records,
  });
});

export default router;
