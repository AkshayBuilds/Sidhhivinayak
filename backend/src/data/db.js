import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'vehicles.json');

// In-Memory OTP Store: key = `${chassisNumber}_${email}`, value = { otp, expiresAt, record }
export const otpStore = new Map();

// Helper to load vehicle records
export const getVehicleRecords = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialData = [
        {
          id: 'veh_01',
          chassisNumber: 'ME4JC123456789012',
          engineNumber: 'JC56E1098765',
          registrationNumber: 'MH 12 AB 4589',
          customerName: 'Rahul Suresh Sharma',
          email: 'rahul.sharma@gmail.com',
          phone: '+91 98765 43210',
          address: 'Flat 402, Shanti Heights, Kothrud, Pune - 411038',
          brand: 'Hero',
          model: 'Splendor Plus XTEC',
          variant: 'Disc OBD-2',
          color: 'Canvas Black',
          purchaseDate: '2025-08-14',
          invoiceNumber: 'SV-INV/2025/1042',
          invoiceAmount: 96450,
          exShowroomPrice: 79900,
          gstAmount: 14382,
          insuranceCompany: 'ICICI Lombard General Insurance',
          insurancePolicyNumber: 'POL-ICICI-2025-983412',
          insuranceType: '1 Year Comprehensive + 5 Years Third Party Liability',
          insuranceValidFrom: '14-Aug-2025',
          insuranceValidTo: '13-Aug-2030',
          insuranceIdv: 75900,
          insurancePremium: 5850,
          hypothecationBank: 'HDFC Bank Auto Finance',
          salesExecutive: 'Vikas Deshmukh',
          dealershipBranch: 'Main Showroom, Pune Branch',
          invoiceFileUrl: '/uploads/documents/sample-invoice.pdf',
          insuranceFileUrl: '/uploads/documents/sample-insurance.pdf'
        },
        {
          id: 'veh_02',
          chassisNumber: 'ME4JF987654321098',
          engineNumber: 'JF91E7654321',
          registrationNumber: 'MH 14 CD 9921',
          customerName: 'Priya Nilesh Patel',
          email: 'priya.patel@yahoo.com',
          phone: '+91 98220 11223',
          address: 'B-12, Green Acres, Wakad, Pune - 411057',
          brand: 'Honda',
          model: 'Activa 6G H-Smart',
          variant: 'Smart Key Edition',
          color: 'Pearl Siren Blue',
          purchaseDate: '2025-09-02',
          invoiceNumber: 'SV-INV/2025/1188',
          invoiceAmount: 104200,
          exShowroomPrice: 83500,
          gstAmount: 15030,
          insuranceCompany: 'HDFC ERGO General Insurance',
          insurancePolicyNumber: 'POL-HDFC-2025-447812',
          insuranceType: '1 Year Comprehensive + 5 Years Third Party',
          insuranceValidFrom: '02-Sep-2025',
          insuranceValidTo: '01-Sep-2030',
          insuranceIdv: 79325,
          insurancePremium: 6150,
          hypothecationBank: 'Bajaj Finserv Limited',
          salesExecutive: 'Sneha Kulkarni',
          dealershipBranch: 'Wakad Branch, Pune',
          invoiceFileUrl: '/uploads/documents/sample-invoice.pdf',
          insuranceFileUrl: '/uploads/documents/sample-insurance.pdf'
        },
        {
          id: 'veh_03',
          chassisNumber: 'ME4RE555444333221',
          engineNumber: 'REJ350-998811',
          registrationNumber: 'MH 12 XY 7700',
          customerName: 'Amit Rajendra Verma',
          email: 'amit.verma@outlook.com',
          phone: '+91 99701 88990',
          address: 'Plot 77, Silver Oak Residency, Baner, Pune - 411045',
          brand: 'Royal Enfield',
          model: 'Classic 350',
          variant: 'Dark Stealth Black (Dual Channel ABS)',
          color: 'Stealth Black Matte',
          purchaseDate: '2025-07-20',
          invoiceNumber: 'SV-INV/2025/0895',
          invoiceAmount: 248500,
          exShowroomPrice: 220000,
          gstAmount: 61600,
          insuranceCompany: 'Digit General Insurance Ltd',
          insurancePolicyNumber: 'POL-DIGIT-2025-667123',
          insuranceType: '1 Year Zero Depreciation + 5 Years Third Party TP',
          insuranceValidFrom: '20-Jul-2025',
          insuranceValidTo: '19-Jul-2030',
          insuranceIdv: 209000,
          insurancePremium: 9800,
          hypothecationBank: 'ICICI Bank Two-Wheeler Loans',
          salesExecutive: 'Mahesh Jadhav',
          dealershipBranch: 'Main Showroom, Pune Branch',
          invoiceFileUrl: '/uploads/documents/sample-invoice.pdf',
          insuranceFileUrl: '/uploads/documents/sample-insurance.pdf'
        }
      ];
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading vehicle records:', error);
    return [];
  }
};

// Helper to find a vehicle by chassis number and email
export const findVehicle = (chassisNumber, email) => {
  const records = getVehicleRecords();
  const cleanChassis = chassisNumber.trim().toUpperCase();
  const cleanEmail = email.trim().toLowerCase();

  return records.find(
    (r) =>
      r.chassisNumber.toUpperCase() === cleanChassis &&
      r.email.toLowerCase() === cleanEmail
  );
};

// Helper to save/add a new vehicle record
export const saveVehicleRecord = (newRecord) => {
  const records = getVehicleRecords();
  const updated = [...records.filter(r => r.chassisNumber.toUpperCase() !== newRecord.chassisNumber.toUpperCase()), newRecord];
  fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
  return newRecord;
};
