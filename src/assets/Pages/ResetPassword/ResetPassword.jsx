import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from "react-helmet-async";
import styled from 'styled-components';
import { FaCheck, FaExclamationTriangle, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import 'animate.css';

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
  }
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
  }
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
`;

export default function ResetPassword() {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        oldPassword: Yup.string()
            .required('Current password is required'),
        password: Yup.string()
            .required('New password is required')
            .min(6, 'Password must be at least 6 characters')
            .notOneOf([Yup.ref('oldPassword')], 'New password must be different from current password')
    });

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            password: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            setErrorMsg(null);
            setSuccessMsg(null);
            
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.post(
                    'https://flowers-vert-six.vercel.app/api/user/reset-password',
                    values,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.status === 200) {
                    setSuccessMsg('Password reset successfully');
                    setTimeout(() => {
                        navigate('/profile');
                    }, 2000);
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        setErrorMsg('Invalid current password');
                    } else {
                        setErrorMsg(error.response.data.message || 'An error occurred');
                    }
                } else {
                    setErrorMsg('Network error. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <>
            <Helmet>
                <title>Reset Password | Love Acts</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 p-2">
                <FormContainer className="w-full max-w-md p-8 animate__animated animate__bounceInRight">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center justify-center gap-2 mb-2">
                            <FaLock className="text-[#CF848A] text-4xl mb-2" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Reset Your Password</h2>
                        <p className="text-gray-500">Enter your current and new password</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center">
                            <FaExclamationTriangle className="mr-2" />
                            {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg border border-green-200 flex items-center">
                            <FaCheck className="mr-2" />
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div className="relative z-0 w-full group">
                            <div className="relative">
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    id="oldPassword"
                                    name="oldPassword"
                                    className={`block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                                        formik.touched.oldPassword && formik.errors.oldPassword
                                        ? "border-red-300"
                                        : "border-gray-300"
                                    } appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer`}
                                    placeholder=" "
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.oldPassword}
                                />
                                <label
                                    htmlFor="oldPassword"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Current Password
                                </label>
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    tabIndex={-1}
                                    aria-label={showOldPassword ? "Hide password" : "Show password"}
                                >
                                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {formik.touched.oldPassword && formik.errors.oldPassword && (
                                <ErrorMessage>
                                    <FaExclamationTriangle className="mr-1" />
                                    {formik.errors.oldPassword}
                                </ErrorMessage>
                            )}
                        </div>

                        <div className="relative z-0 w-full group">
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className={`block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                                        formik.touched.password && formik.errors.password
                                        ? "border-red-300"
                                        : "border-gray-300"
                                    } appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer`}
                                    placeholder=" "
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                                <label
                                    htmlFor="password"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    New Password
                                </label>
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    tabIndex={-1}
                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <ErrorMessage>
                                    <FaExclamationTriangle className="mr-1" />
                                    {formik.errors.password}
                                </ErrorMessage>
                            )}
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
                                    Resetting...
                                </>
                            ) : (
                                <>
                                    Reset Password
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </>
                            )}
                        </SubmitButton>

                        <div className="text-center text-sm text-gray-600">
                            Remember your password?{' '}
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