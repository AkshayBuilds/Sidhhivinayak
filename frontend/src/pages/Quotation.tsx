import React, { useState, useEffect } from 'react';
import { VEHICLE_DATA } from '../data/Quotation'; // Import the vehicle data
import {
  User, Phone, Mail, Bike, CreditCard, Calculator,
  Calendar,HelpCircle, Send, MessageCircle, ArrowRight, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Constants
const INTEREST_RATE = 10.99;
const TENURE_OPTIONS = [3, 6, 12, 18, 24, 30, 36];

const BRAND_LOGOS = {
  "HERO": "/herocompany.png",
  "Honda": "/hondalogomain.png",
  "TVS": "/tvslogo.png",
  "Suzuki": "/suzukilogo.png",
  "Yamaha": "/yamahalogo.png",
  "Royal Enfield": "/royalenfieldlogo.png",
  "Bajaj": "/bajajlogo.png",
  "KTM": "/ktmlogo.png"
};

interface FormData {
  name: string;
  phone: string;
  email: string;
  brand: string;
  model: string;
  paymentType: 'cash' | 'loan';
  downPayment: string;
  tenure: string;
  oldVehicleDetails: string;
  exchangeVehicle?: 'yes' | 'no';
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  brand: '',
  model: '',
  paymentType: 'cash',
  downPayment: '',
  tenure: '12',
  oldVehicleDetails: '',
  exchangeVehicle: 'no'
};

function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [models, setModels] = useState<{ name: string; price: number }[]>([]);
  const [selectedModelPrice, setSelectedModelPrice] = useState<number>(0);
  const [emi, setEmi] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.brand) {
      const brandData = VEHICLE_DATA.find(v => v.brand === formData.brand);
      setModels(brandData?.models || []);

      // Auto-refresh logic
      setTimeout(() => {
      }, 1000); // Adjust the timeout duration as needed
    }
  }, [formData.brand]);

  useEffect(() => {
    if (formData.model) {
      const modelData = models.find(m => m.name === formData.model);
      setSelectedModelPrice(modelData?.price || 0);
    }
  }, [formData.model, models]);

  useEffect(() => {
    if (formData.paymentType === 'loan' && formData.downPayment && selectedModelPrice) {
      const principal = selectedModelPrice - Number(formData.downPayment);
      const annualInterestRate = INTEREST_RATE;
      const tenureMonths = Number(formData.tenure);

      // Calculate total interest
      const totalInterest = (principal * annualInterestRate * (tenureMonths / 12)) / 100;

      // Calculate total amount to be repaid
      const totalAmountToBeRepaid = principal + totalInterest;

      // Calculate monthly EMI
      const monthlyEmi = totalAmountToBeRepaid / tenureMonths;

      setEmi(Math.round(monthlyEmi));
    }
  }, [formData.downPayment, formData.tenure, selectedModelPrice, formData.paymentType]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const processedFormData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        brand: formData.brand,
        model: formData.model,
        payment_type: formData.paymentType,
        down_payment: Number(formData.downPayment) || 0,
        tenure: Number(formData.tenure),
        exchange_vehicle: formData.exchangeVehicle || 'no',
        old_vehicle_details: formData.oldVehicleDetails || 'None'
      };

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/api/quotation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to send quotation");
      }

      alert("Quotation sent successfully!");
      setFormData(initialFormData);

    } catch (error) {
      console.error('Error:', error);
      alert("Wrong email?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Get Your Dream Bike Quote
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fill out the form below and we'll provide you with a detailed quote for your desired bike.
            Our team will contact you within 24 hours.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0"
                  style={{
                    backgroundImage: 'url("/pattern-bikes.png")',
                    backgroundSize: '60px 60px',
                    backgroundRepeat: 'repeat'
                  }}
                />
              </div>

              {/* Form Header */}
              <div className="relative flex items-center justify-center mb-8">
                <Calculator className="h-14 w-14 text-blue-600" />
              </div>

              <form className="relative space-y-8" onSubmit={handleChange} method='post'>
                {/* Personal Information */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-blue-500 opacity-70 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="peer w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl
                                 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                                 transition-all duration-300 outline-none text-gray-700
                                 hover:border-blue-200 shadow-sm text-base font-medium"
                        required
                      />
                      <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none
                                     transition-opacity duration-300 peer-focus:opacity-0 peer-valid:opacity-0 text-base">
                        Enter your full name
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-blue-500 opacity-70 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="peer w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 roundedi cnat s-xl
                                 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                                 transition-all duration-300 outline-none text-gray-700
                                 hover:border-blue-200 shadow-sm text-base font-medium"
                        required
                        maxLength={10}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-blue-500 opacity-70 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="peer w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl
                                 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                                 transition-all duration-300 outline-none text-gray-700
                                 hover:border-blue-200 shadow-sm text-base font-medium"
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Vehicle Selection */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Brand
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {formData.brand ? (
                          <img
                            src={BRAND_LOGOS[formData.brand as keyof typeof BRAND_LOGOS]}
                            alt={`${formData.brand} logo`}
                            className="h-5 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <Bike className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                        )}
                      </div>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl
                                 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                                 transition-all duration-300 outline-none text-gray-700
                                 hover:border-blue-200 shadow-sm appearance-none cursor-pointer
                                 text-base font-medium"
                        required
                      >
                        <option value="">Select Brand</option>
                        {VEHICLE_DATA.map(brand => (
                          <option key={brand.brand} value={brand.brand}>{brand.brand}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Model
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Bike className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                      </div>
                      <select
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl
                                 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                                 transition-all duration-300 outline-none text-gray-700
                                 hover:border-blue-200 shadow-sm appearance-none cursor-pointer
                                 text-base font-medium"
                        required
                      >
                        <option value="">Select Model</option>
                        {models.map(model => (
                          <option key={model.name} value={model.name}>{model.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Type Radio Buttons */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Type
                  </label>
                  <div className="flex gap-6">
                    <label className="inline-flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="paymentType"
                        value="cash"
                        checked={formData.paymentType === 'cash'}
                        onChange={handleInputChange}
                        className="form-radio h-5 w-5 text-blue-600 border-2 border-gray-300
                                 focus:ring-blue-500 cursor-pointer transition-all duration-300"
                      />
                      <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">Cash</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="paymentType"
                        value="loan"
                        checked={formData.paymentType === 'loan'}
                        onChange={handleInputChange}
                        className="form-radio h-5 w-5 text-blue-600 border-2 border-gray-300
                                 focus:ring-blue-500 cursor-pointer transition-all duration-300"
                      />
                      <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">Loan</span>
                    </label>
                  </div>
                </div>

                {formData.paymentType === 'loan' && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Down Payment
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <CreditCard className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                        </div>
                        <input
                          type="number"
                          name="downPayment"
                          value={formData.downPayment}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                                   focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                   transition-all duration-300 outline-none text-gray-700
                                   hover:border-blue-300"
                          min="0"
                          max={selectedModelPrice}
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tenure (months)
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                        </div>
                        <select
                          name="tenure"
                          value={formData.tenure}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                                   focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                   transition-all duration-300 outline-none text-gray-700
                                   hover:border-blue-300 appearance-none cursor-pointer"
                          required
                        >
                          {TENURE_OPTIONS.map(t => (
                            <option key={t} value={t}>{t} months</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Exchange Options */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Exchange Options</h2>
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Do you have a vehicle for exchange?
                    </label>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="exchangeVehicle"
                          value="yes"
                          checked={formData.exchangeVehicle === 'yes'}
                          onChange={e => setFormData({ ...formData, exchangeVehicle: e.target.value as 'yes' | 'no' })}
                          className="form-radio h-5 w-5 text-blue-600 border-2 border-gray-300
                                   focus:ring-blue-500 cursor-pointer transition-all duration-300"
                        />
                        <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">Yes</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="exchangeVehicle"
                          value="no"
                          checked={formData.exchangeVehicle === 'no'}
                          onChange={e => setFormData({ ...formData, exchangeVehicle: e.target.value as 'yes' | 'no' })}
                          className="form-radio h-5 w-5 text-blue-600 border-2 border-gray-300
                                   focus:ring-blue-500 cursor-pointer transition-all duration-300"
                        />
                        <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">No</span>
                      </label>
                    </div>
                  </div>

                  {formData.exchangeVehicle === 'yes' && (
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Old Vehicle Details
                      </label>
                      <div className="relative group">
                        <textarea
                          name="oldVehicleDetails"
                          rows={3}
                          placeholder="Please provide details of your old vehicle (Brand, Model, Year, Condition)"
                          className="w-full px-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl
                                   focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                                   transition-all duration-300 outline-none text-gray-700 placeholder-gray-400
                                   hover:border-blue-200 shadow-sm resize-none
                                   text-base font-medium"
                          value={formData.oldVehicleDetails}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quotation Summary with enhanced styling */}
                {selectedModelPrice > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Calculator className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Quotation Summary</h2>
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-700">On-Road Price: ₹{selectedModelPrice.toLocaleString()}</p>
                      {formData.paymentType === 'loan' && formData.downPayment && (
                        <>
                          <p className="text-gray-700">Down Payment: ₹{Number(formData.downPayment).toLocaleString()}</p>
                          <p className="text-gray-700">
                            Loan Amount: ₹{(selectedModelPrice - Number(formData.downPayment)).toLocaleString()}
                          </p>
                          <p className="text-gray-700">Tenure: {formData.tenure} months</p>
                          <p className="text-xl font-bold text-indigo-600">Monthly EMI: ₹{emi.toLocaleString()}</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto group relative flex justify-center py-3 px-6 
                             bg-blue-600 text-white rounded-lg font-medium
                             hover:bg-blue-700 focus:outline-none focus:ring-2 
                             focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <img
                          src="/loadingbike.gif"
                          alt="Loading..."
                          className="h-5 w-11 mr-3 text-white"
                        />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="mr-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                        <span>Get Your Quote Now</span>
                      </div>
                    )}
                  </button>

                  <Link
                    to="/contact"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span>Need Help?</span>
                  </Link>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Side - Assistance Section */}
          <div className="space-y-6">
            {/* Need Assistance Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
              <p className="text-lg mb-6">Our team is here to help you make the right choice for your dream bike.</p>
              <div className="space-y-4">
                <Link
                  to="tel:+919998303810"
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm w-full px-4 py-3 rounded-xl
                           hover:bg-white/20 transition-all duration-300"
                >
                  <Phone className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-semibold">Call Us</p>
                    <p className="text-sm text-gray-200">+91 9998303810</p>
                  </div>
                </Link>

                <a
                  href="https://wa.me/+919998303810"
                  target="_blank"
                  className="flex items-center gap-3 bg-green-500 w-full px-4 py-3 rounded-xl
                           hover:bg-green-600 transition-all duration-300"
                >
                  <MessageCircle className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-semibold">WhatsApp</p>
                    <p className="text-sm text-gray-100">Chat with us</p>
                  </div>
                </a>
              </div>
            </motion.div>
            {/* Special Offer Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-8 text-white"
            >
              <h3 className="text-xl font-bold mb-2">Special Offer!</h3>
              <p className="mb-4">Get exclusive deals and special financing options on selected models.</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg
                         hover:bg-orange-50 transition-colors"
              >
                View Models
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


