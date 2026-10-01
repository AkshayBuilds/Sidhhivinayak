import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, User, MessageSquare, 
  Send, ExternalLink, MessageCircle, Star, RefreshCw 
} from 'lucide-react';
import { motion } from 'framer-motion';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.detail || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbersOnly = value.replace(/[^0-9]/g, '');
    const limitedLength = numbersOnly.slice(0, 10);
    setFormData(prev => ({ ...prev, phone: limitedLength }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: 'url("/showroom-bg.jpg")' }}
          />
        </div>
        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-10">We're Here to Help!</h1>
            <p className="text-xl text-blue-100">
              Get in touch with us for any questions about our bikes or services
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-blue-500 opacity-70 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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

                  <div className="form-group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-blue-500 opacity-70 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneInput}
                        className="peer w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl
                                 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                                 transition-all duration-300 outline-none text-gray-700
                                 hover:border-blue-200 shadow-sm text-base font-medium"
                        required
                        maxLength={10}
                      />
                      <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none
                                     transition-opacity duration-300 peer-focus:opacity-0 peer-valid:opacity-0 text-base">
                        Enter your phone number
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-blue-500 opacity-70 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="peer w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl
                               focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                               transition-all duration-300 outline-none text-gray-700
                               hover:border-blue-200 shadow-sm text-base font-medium"
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message
                  </label>
                  <div className="relative group">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <MessageSquare className="h-5 w-5 mt-2.5 text-blue-500 opacity-70 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="peer w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl
                               focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                               transition-all duration-300 outline-none text-gray-700
                               hover:border-blue-200 shadow-sm text-base font-medium resize-none"
                      required
                    />
                    <span className="absolute left-12 top-[1.125rem] text-gray-400 pointer-events-none
                                   transition-opacity duration-300 peer-focus:opacity-0 peer-valid:opacity-0 text-base">
                      How can we help you?
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full group relative flex justify-center py-3.5 px-6 
                           bg-blue-600 text-white rounded-xl font-medium
                           hover:bg-blue-700 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300
                           transform hover:scale-[1.02]"
                >
                  {status === 'loading' ? (
                    <div className="flex items-center">
                      <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="mr-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                      <span>Send Message</span>
                    </div>
                  )}
                </button>

                {status === 'success' && (
                  <div className="text-green-600 text-center bg-green-50 p-4 rounded-lg">
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                {status === 'error' && (
                  <div className="text-red-600 text-center bg-red-50 p-4 rounded-lg">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Customer Review */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 bg-blue-50 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-semibold">What Our Customers Say</h3>
              </div>
              <p className="text-gray-600 italic">
                "Great service and amazing selection of bikes! The team was very helpful 
                in finding the perfect bike for me. Highly recommended!"
              </p>
              <p className="text-gray-900 font-medium mt-2">- Rahul Patel</p>
            </motion.div>
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h2>
              <div className="space-y-6">
                <a 
                  href="tel:+919998303810" 
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-blue-600">+91 9998303810</p>
                  </div>
                </a>

                <a 
                  href="mailto:sidhhivinayakautoworld@gmail.com"
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-blue-600 break-all">sidhhivinayakautoworld@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-start space-x-4 p-4">
                  <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Business Hours</p>
                    <p className="text-gray-600">Monday - Saturday: 9:30 AM - 7:30 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>

                <a 
                  href="https://maps.app.goo.gl/MRmLnGjDgr9rEVUv8"
                  target="_blank"
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">
                      G 8,9,10, Shyam Satva Residency, Naroda - Dehgam Rd, 
                      opp. Hp petrol pump, nr. GEB OFFICE, Vasant Vihar 2, 
                      Naroda, Ahmedabad. Gujarat - 382330
                    </p>
                    <span className="inline-flex items-center text-blue-600 mt-2 hover:underline">
                      Get Directions
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Quick Contact Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white"
            >
              <h3 className="text-xl font-bold mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <a
                  href="tel:+919998303810"
                  className="flex items-center gap-3 bg-white/10 w-full px-4 py-3 rounded-xl
                           hover:bg-white/20 transition-all duration-300"
                >
                  <Phone className="h-5 w-5" />
                  <span>Call Us Now</span>
                </a>

                <a
                  href="https://wa.me/+919998303810"
                  target="_blank"
                  className="flex items-center gap-3 bg-green-500 w-full px-4 py-3 rounded-xl
                           hover:bg-green-600 transition-all duration-300"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.475107654472!2d72.66706527531552!3d23.07969747913379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e81a1d522f163%3A0x36711c4d11b99bb3!2sSIDHHIVINAYAK%20AUTO%20WORLD!5e0!3m2!1sen!2sin!4v1732263945108!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="w-full"
                ></iframe>
              </div>
              <div className="p-4">
                <a
                  href="https://maps.app.goo.gl/MRmLnGjDgr9rEVUv8"
                  target="_blank"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Get Directions
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
