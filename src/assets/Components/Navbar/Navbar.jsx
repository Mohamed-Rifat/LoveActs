import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToken } from '../../Context/TokenContext/TokenContext';
import toast from 'react-hot-toast';
import { TiWarningOutline } from 'react-icons/ti';
import 'animate.css';
import { FaShoppingCart, FaHeart, FaUserCircle } from "react-icons/fa";
import { CartContext } from '../../Context/CartContext';

const Navbar = () => {
  const { token, user, setUser, removeToken } = useToken();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const navigate = useNavigate();
  const { numOfCartItems } = useContext(CartContext);

  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [setUser]);

  useEffect(() => {
    const handleClickOutsideUserMenu = (event) => {
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideUserMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUserMenu);
    };
  }, [isUserMenuOpen]);

  useEffect(() => {
    const handleClickOutsideMobileMenu = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideMobileMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMobileMenu);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    removeToken(); 
    setIsUserMenuOpen(false);
    setLogoutModalOpen(false);
    toast.success("Goodbye! 👋", { duration: 4000 });
    navigate('/login');
  };

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(false);
    setLogoutModalOpen(true);
  };

  return (
    <nav className="bg-[#FDE9EE] shadow-lg relative z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 container">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0 flex items-center">
              <img className="h-28 w-auto" src="./Logo.PNG" alt="Love Acts Logo" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <>
                <Link
                  to="/home"
                  className="text-gray-700 hover:text-[#CF848A] px-1 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-[#CF848A] px-1 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Products
                </Link>
                <Link
                  to="/cafes"
                  className="text-gray-700 hover:text-[#CF848A] px-1 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Cafe
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-[#CF848A] px-1 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  About Us
                </Link>
                {user?.role === "Admin" && (
                  <Link
                    to="/admindashboard"
                    className="text-gray-700 hover:text-[#CF848A] px-1 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user?.role === "User" && (
                  <Link
                    to="/cart"
                    className="relative text-gray-700 hover:text-[#CF848A] transition-all duration-300">
                    <FaShoppingCart className="text-2xl" />
                    <span className="absolute -top-2.5 -right-2.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-[#ffb9cb] rounded-full">
                      {numOfCartItems}
                    </span>
                  </Link>
                )}
                {user?.role === "User" && (
                  <Link
                    to="/wishlist"
                    className="relative text-gray-700 hover:text-[#CF848A] transition-all duration-300">
                    <FaHeart className="text-2xl" />
                  </Link>
                )}
                <div className="relative">
                  <div ref={userButtonRef}>
                    <FaUserCircle
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="text-2xl cursor-pointer text-gray-700 hover:text-[#CF848A] transition-colors duration-300"
                    />
                  </div>

                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 origin-top-right animate-fadeIn"
                      ref={userMenuRef}
                    >
                      <div className="px-4 py-3 text-sm text-gray-900 ">

                        <p className='text-base font-semibold'>{localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name : "User"}</p>
                      </div>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left block px-4 py-2 text-red-500 hover:bg-red-50 transition-colors duration-200"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-[#CF848A] px-1 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-[#CF848A] px-1 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Register
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                  <a href="https://www.instagram.com/loveacts.co?igsh=NDQ5bHZnYXV1ZTQ2" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://www.facebook.com/share/1C97Fizo2P/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://www.tiktok.com/@loveacts.co?_t=ZS-8zFial8Lug4&_r=1" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>
                </div>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
             {user?.role === "User" && (
                  <Link
                    to="/cart"
                    className="relative text-gray-700 hover:text-[#CF848A] transition-all duration-300">
                    <FaShoppingCart className="text-2xl" />
                    <span className="absolute -top-2.5 -right-2.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-[#ffb9cb] rounded-full">
                      {numOfCartItems}
                    </span>
                  </Link>
                )}
            <button
              ref={mobileButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 ms-5"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div
          ref={mobileMenuRef}
          className={`md:hidden absolute top-20 left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out z-50
          ${isMobileMenuOpen ? 'opacity-100 py-2' : 'opacity-0 pointer-events-none py-0'}`}
        >
          <div className="space-y-1 pb-2">
            {token ? (
              <>
                <Link
                  to="/home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CF848A] hover:bg-gray-100"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CF848A] hover:bg-gray-100"
                >
                  Products
                </Link>
                <Link
                  to="/cafes"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CF848A] hover:bg-gray-100"
                >
                  Cafe
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CF848A] hover:bg-gray-100"
                >
                  About Us
                </Link>
                {user?.role === "Admin" && (
                  <Link
                    to="/admindashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CF848A] hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CF848A] hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CF848A] hover:bg-gray-100"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CF848A] hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#CF848A] hover:bg-gray-100"
                >
                  Register
                </Link>
              </>
            )}


            <div className="flex justify-center space-x-6 pt-3">
              <a href="https://www.instagram.com/loveacts.co?igsh=NDQ5bHZnYXV1ZTQ2" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.facebook.com/share/1C97Fizo2P/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@loveacts.co?_t=ZS-8zFial8Lug4&_r=1" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {logoutModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setLogoutModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full animate__animated animate__shakeX"
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex flex-wrap items-center'>
              <TiWarningOutline className='text-5xl text-yellow-400' />
              <h2 className="text-3xl font-bold text-red-600 ml-2">Warning</h2>
            </div>
            <p className="text-gray-700 mt-2">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};


export default Navbar; 
