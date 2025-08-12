import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import styled, { keyframes } from 'styled-components';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'animate.css';

const slideInLeft = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px); /* لدعم Safari */
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  animation: ${props => props.direction === 'left' ? slideInLeft : slideInRight} 0.5s ease-out forwards;
`;

const InputField = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #f8fafc;
  
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    outline: none;
    background-color: white;
  }
  
  &:focus + label {
    transform: translateY(-1.5rem) scale(0.85);
    color: #6366f1;
  }
  
  &:not(:placeholder-shown) + label {
    transform: translateY(-1.5rem) scale(0.85);
  }
`;

const InputLabel = styled.label`
  position: absolute;
  left: 3rem;
  top: 1rem;
  color: #94a3b8;
  transition: all 0.3s ease;
  pointer-events: none;
  background-color: ${props => props.hasValue ? '#f8fafc' : 'transparent'};
  padding: 0 0.5rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    animation: ${pulse} 1.5s infinite;
  }
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    animation: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0)
    );
    transform: rotate(30deg);
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    left: 100%;
  }
`;

export default function Register() {

    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .min(3, 'Name must be at least 3 characters'),
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email address'),
        password: Yup.string()
            .required('Password is required')
            .matches(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
            ),
        rePassword: Yup.string()
            .required('Confirm password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        phone: Yup.string()
            .required('Phone number is required')
            .matches(/^01[0125][0-9]{8}$/, 'Phone must be a valid Egyptian number'),
        terms: Yup.boolean()
            .required('You must accept the terms and conditions')
            .oneOf([true], 'You must accept the terms and conditions'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            rePassword: '',
            phone: '',
            terms: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            setErrorMsg(null);
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone,
               
            };
            try {
                const response = await axios.post(
                    'https://flowers-vert-six.vercel.app/api/user/signup',
                    payload
                );

                if (response.status === 201) {
                    setSubmitSuccess(true);
                    setTimeout(() => navigate('/login'), 2000);
                }
            } catch (error) {
                if (error.response) {
                    setErrorMsg(error.response.data.message);
                } else {
                    setErrorMsg('An unexpected error occurred. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <>
            <Helmet>
                <title>Register | Love Acts</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 p-4">
                <FormContainer className="w-full max-w-md p-8 animate__animated animate__bounceInRight">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center justify-center gap-2 mb-2">
                            <img
                                src="/Logo.PNG"
                                alt="Love Acts Logo"
                                className="h-24 w-auto object-contain mb-2"
                            />

                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Create Your Account</h2>
                        <p className="text-gray-500">Join our community today</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center animate-fade-in">
                            <FaExclamationTriangle className="mr-2" />
                            {errorMsg}
                        </div>
                    )}

                    {submitSuccess && (
                        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg border border-green-200 flex items-center animate-fade-in">
                            <FaCheck className="mr-2" />
                            Registration successful! Redirecting to login...
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-5">

                        <div className="relative z-0 w-full group">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${formik.touched.name && formik.errors.name ? 'border-red-300' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer`}
                                placeholder=" "
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                            />
                            <label
                                htmlFor="name"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Full Name
                            </label>
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
                                    <FaExclamationTriangle className="mr-1" />
                                    {formik.errors.name}
                                </div>
                            )}
                        </div>

                        <div className="relative z-0 w-full group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${formik.touched.email && formik.errors.email ? 'border-red-300' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer`}
                                placeholder=" "
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            <label
                                htmlFor="email"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Email Address
                            </label>
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
                                    <FaExclamationTriangle className="mr-1" />
                                    {formik.errors.email}
                                </div>
                            )}
                        </div>

                        <div className="relative z-0 w-full group">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className={`block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${formik.touched.password && formik.errors.password
                                        ? "border-red-300"
                                        : "border-gray-300"
                                        } appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer`}
                                    placeholder=" "
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    aria-invalid={
                                        formik.touched.password && formik.errors.password ? "true" : "false"
                                    }
                                />
                                <label
                                    htmlFor="password"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
                                    <FaExclamationTriangle className="mr-1" />
                                    {formik.errors.password}
                                </div>
                            )}
                        </div>

                        <div className="relative z-0 w-full group">
                             <div className="relative">
                            <input
                                type={showRePassword ? "text" : "password"}
                                id="rePassword"
                                name="rePassword"
                                className={`block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${formik.touched.rePassword && formik.errors.rePassword ? 'border-red-300' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer`}
                                placeholder=" "
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.rePassword}
                            />
                            <label
                                htmlFor="rePassword"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Confirm Password
                            </label>
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                                onClick={() => setShowRePassword(!showRePassword)}
                                tabIndex={-1}
                                aria-label={showRePassword ? "Hide password" : "Show password"}
                            >
                                {showRePassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            </div>
                            {formik.touched.rePassword && formik.errors.rePassword && (
                                <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
                                    <FaExclamationTriangle className="mr-1" />
                                    {formik.errors.rePassword}
                                </div>
                            )}
                        </div>

                        <div className="relative z-0 w-full group">
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className={`block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${formik.touched.phone && formik.errors.phone ? 'border-red-300' : 'border-gray-300'} appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer`}
                                placeholder=" "
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phone}
                            />
                            <label
                                htmlFor="phone"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Phone Number (Egyptian)
                            </label>
                            {formik.touched.phone && formik.errors.phone && (
                                <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
                                    <FaExclamationTriangle className="mr-1" />
                                    {formik.errors.phone}
                                </div>
                            )}
                        </div>


                        <div className="flex items-start mb-6 animate-slide-in-right">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="terms"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    checked={formik.values.terms}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-medium text-gray-700">
                                    I agree to the{' '}
                                    <a href="/terms" className="text-indigo-600 hover:underline">
                                        Terms and Conditions
                                    </a>
                                </label>
                                {formik.touched.terms && formik.errors.terms && (
                                    <ErrorMessage>
                                        <FaExclamationTriangle className="mr-1" />
                                        {formik.errors.terms}
                                    </ErrorMessage>
                                )}
                            </div>
                        </div>

                        <SubmitButton
                            type="submit"
                            disabled={isLoading || !formik.isValid || !formik.dirty}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Register Now
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </>
                            )}
                        </SubmitButton>

                        <div className="text-center text-sm text-gray-600 animate-fade-in">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </FormContainer>
            </div>
        </>
    );
}