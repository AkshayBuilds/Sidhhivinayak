import { Link } from 'react-router-dom';
import {
  Bike,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Clock,
  ArrowUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
        />
      </div>

      <div className="container-custom py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Company Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 mb-4"
            >
              <Bike className="h-20 w-20 text-blue-500" />
              <span className="text-xl font-bold text-white">
                Siddhivinayak Auto World: Your One-Stop Bike Showroom
              </span>
            </motion.div>
            <p className="text-sm text-gray-300">
              Your trusted multibrand two-wheeler showroom, offering premium bikes and exceptional service since 2020.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: "/", text: "Home" },
                { to: "/about", text: "About Us" },
                { to: "/products", text: "Products" },
                { to: "/offers", text: "Offers & Deals" },
                { to: "/download-docs", text: "Download Bill & Insurance" },
                { to: "/quotation", text: "Quotation" },
                { to: "/contact", text: "Contact Us" }
              ].map((link, index) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.to}
                    onClick={scrollToTop}
                    className="group relative inline-block hover:text-blue-400 transition-colors"
                  >
                    <span>{link.text}</span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-2 group"
              >
                <Phone className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                <a href="tel:+919998303810" className="hover:text-blue-400 transition-colors">
                  +91 9998303810
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center space-x-2 group"
              >
                <Mail className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                <a href="mailto:sidhhivinayakautoworld@gmail.com" className="hover:text-blue-400 transition-colors">
                  sidhhivinayakautoworld@gmail.com
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-start space-x-2 group"
              >
                <MapPin className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                <div className="flex flex-col">
                  <a
                    href='https://maps.app.goo.gl/MRmLnGjDgr9rEVUv8'
                    target='_blank'
                    className="hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    G 8,9,10, Shyam Satva Residency, Naroda - Dehgam Rd, opp. Hp petrol pump, nr. GEB OFFICE, Vasant Vihar 2, Naroda, Ahmedabad. Gujarat - 382330
                  </a>
                </div>
              </motion.li>
            </ul>
          </div>

          {/* Social Media & Business Hours */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              <a
                href="https://wa.me/+919998303810"
                target='_blank'
                className="group"
              >
                <MessageCircle className="h-6 w-6 text-gray-400 group-hover:text-green-500 transform group-hover:scale-110 transition-all" />
              </a>
              <a
                href="https://www.instagram.com/sidhhivinayak_auto__world/"
                target='_blank'
                className="group"
              >
                <Instagram className="h-6 w-6 text-gray-400 group-hover:text-pink-500 transform group-hover:scale-110 transition-all" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Business Hours
              </h4>
              <p className="text-sm text-gray-300">Monday - Saturday: 9:30 AM - 7:30 PM</p>
              <p className="text-sm text-gray-300">Sunday: Closed</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>© {new Date().getFullYear()} Sidhhivinayak Auto World. All rights reserved.</p>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg 
                   hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 z-50"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      </div>
    </footer>
  );
}

export default Footer;