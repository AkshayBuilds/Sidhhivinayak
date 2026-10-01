import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Calculator, FileText } from 'lucide-react';

const brands = [
  'Hero',
  'Honda',
  'TVS',
  'Royal Enfield',
  'Bajaj',
  'Suzuki',
  'Yamaha',
  'KTM',
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleBrands = () => setShowBrands(!showBrands);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    // Fade out
    document.body.style.opacity = '0';
    
    // Reduced delay from 300ms to 150ms
    setTimeout(() => {
      navigate(path);
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
      
      // Fade in
      document.body.style.opacity = '1';
      
      // Close mobile menu if open
      if (isOpen) setIsOpen(false);
    }, 100); // Reduced timeout
  };

  // Add this function to check if we're on a page that needs dark text
  const needsDarkText = () => {
    const darkTextRoutes = ['/offers', '/quotation', '/products', '/download-docs'];
    // Check if current path starts with any of the dark text routes
    return darkTextRoutes.some(route => location.pathname.startsWith(route));
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled || isOpen ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container-custom relative">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          scrolled ? 'h-16' : 'h-24'
        }`}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/');
            }}
            className={`flex items-center gap-3 transition-all duration-300 ${
              scrolled ? 'scale-95' : 'scale-100'
            }`}
          >
            <img
              src="/SV.png"
              alt="Sidhhivinayak Logo" 
              className={`transition-all duration-300 object-contain ${
                scrolled ? 'h-10 w-auto' : 'h-12 w-auto'
              }`}
            />
            <div className="flex flex-col">
              <span className={`font-bold leading-tight transition-all duration-300 ${
                scrolled || isOpen || needsDarkText() ? 'text-gray-900' : 'text-white'
              } ${scrolled ? 'text-lg' : 'text-xl'}`}>
                SIDHHIVINAYAK
              </span>
              <span className={`font-medium leading-tight transition-all duration-300 ${
                scrolled || isOpen || needsDarkText() ? 'text-gray-900' : 'text-white'
              } ${scrolled ? 'text-sm' : 'text-base'}`}>
                AUTO WORLD
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Only visible on lg screens and above */}
          <div className={`hidden lg:flex items-center space-x-6 xl:space-x-8 transition-all duration-300 ${
            scrolled ? 'text-sm' : 'text-base'
          }`}>
            <button
              onClick={() => handleNavigation('/')}
              className={`hover:text-blue-600 transition-colors ${
                isActive('/') ? 'text-blue-600' : scrolled || isOpen || needsDarkText() ? 'text-gray-700' : 'text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation('/about')}
              className={`hover:text-blue-600 transition-colors ${
                isActive('/about') ? 'text-blue-600' : scrolled || isOpen || needsDarkText() ? 'text-gray-700' : 'text-white'
              }`}
            >
              About Us
            </button>
            <div className="relative group">
              <button
                onClick={toggleBrands}
                className={`flex items-center space-x-1 hover:text-blue-600 transition-colors ${
                  scrolled || isOpen || needsDarkText() ? 'text-gray-700' : 'text-white'
                }`}
              >
                <span>Products</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 hidden group-hover:block">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleNavigation(`/products/${brand.toLowerCase().replace(' ', '-')}`)}
                    className={`block px-4 py-2 hover:text-blue-600 transition-colors ${
                      isActive(`/products/${brand.toLowerCase().replace(' ', '-')}`) ? 'text-blue-600' : scrolled || isOpen || needsDarkText() ? 'text-gray-700' : 'text-gray-700'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => handleNavigation('/offers')}
              className={`hover:text-blue-600 transition-colors ${
                isActive('/offers') ? 'text-blue-600' : scrolled || isOpen || needsDarkText() ? 'text-gray-700' : 'text-white'
              }`}
            >
              Offers & Deals
            </button>
            <button
              onClick={() => handleNavigation('/download-docs')}
              className={`hover:text-blue-600 transition-colors flex items-center space-x-1.5 ${
                isActive('/download-docs') ? 'text-blue-600' : scrolled || isOpen || needsDarkText() ? 'text-gray-700' : 'text-white'
              }`}
            >
              <FileText className="h-4 w-4 text-blue-500" />
              <span>Bill & Insurance</span>
            </button>
            <button
              onClick={() => handleNavigation('/quotation')}
              className={`hover:text-blue-600 transition-colors flex items-center space-x-1 ${
                isActive('/quotation') ? 'text-blue-600' : scrolled || isOpen || needsDarkText() ? 'text-gray-700' : 'text-white'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>Get Quote</span>
            </button>
            <button
              onClick={() => handleNavigation('/contact')}
              className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Phone className="h-4 w-4" />
              <span>Contact Us</span>
            </button>
          </div>

          {/* Toggle Menu Button - Visible on all screens below lg */}
          <button
            onClick={toggleMenu}
            className={`lg:hidden transition-all duration-300 p-2 rounded-lg ${
              scrolled || isOpen || needsDarkText() 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            } ${scrolled ? 'scale-90' : 'scale-100'}`}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile/Tablet Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden py-6 bg-white border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-1"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-1"
                onClick={toggleMenu}
              >
                About Us
              </Link>
              <div className="px-4">
                <button
                  onClick={toggleBrands}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 transition-colors py-1"
                >
                  <span className='flex'>Products
                  <ChevronDown className={`h-4 w-4 mt-1 ml-0.5 transform transition-transform ${showBrands ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                {showBrands && (
                  <div className="pl-4 mt-2 space-y-2">
                    {brands.map((brand) => (
                      <Link
                        key={brand}
                        to={`/products/${brand.toLowerCase().replace(' ', '-')}`}
                        className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        {brand}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link
                to="/offers"
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-1"
                onClick={toggleMenu}
              >
                Offers & Deals
              </Link>
              <Link
                to="/download-docs"
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2 px-4 py-1 font-medium text-blue-600"
                onClick={toggleMenu}
              >
                <FileText className="h-4 w-4" />
                <span>Download Bill & Insurance</span>
              </Link>
              <Link
                to="/quotation"
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2 px-4 py-1"
                onClick={toggleMenu}
              >
                <Calculator className="h-4 w-4" />
                <span>Get Quote</span>
              </Link>
              <div className="px-4 pt-2">
                <Link
                  to="/contact"
                  className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors w-full justify-center shadow-sm"
                  onClick={toggleMenu}
                >
                  <Phone className="h-4 w-4" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;