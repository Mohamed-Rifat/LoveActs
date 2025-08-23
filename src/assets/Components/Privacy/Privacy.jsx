import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaCheck, FaExclamationTriangle, FaEye, FaEyeSlash, FaLock, FaArrowLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const FormContainer = ({ children, className }) => (
    <div className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 ${className}`}>
        {children}
    </div>
);

const ErrorMessage = ({ children }) => (
    <p className="mt-2 text-sm text-red-600 flex items-center">
        {children}
    </p>
);

const SubmitButton = ({ children, disabled, className, ...props }) => (
    <button
        {...props}
        disabled={disabled}
        className={`py-3 px-6 bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);

export default function Privacy() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
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
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.post(
                    'https://flowers-vert-six.vercel.app/api/user/reset-password',
                    values,
                    {
                        headers: {
                            'Authorization': `User ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.status === 200) {
                    setSuccessMsg('Password changed successfully');
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                }
            } catch (error) {
                console.error("Error resetting password:", error.response?.data || error.message);
                if (error.response) {
                    if (error.response.status === 401) {
                        setErrorMsg('Current password is incorrect');
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
        <div className="min-h-screen py-8 px-4">
            <Helmet>
                <title>Change Password | Love Acts</title>
            </Helmet>

            <div className="container max-w-6xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 mb-6 hover:text-gray-800 transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Settings
                </button>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-2/3">
                        <FormContainer>
                            <div className="text-center mb-6 md:mb-8">
                                <div className="flex flex-col items-center justify-center gap-2 mb-2">
                                    <FaLock className="text-[#EC4899] text-3xl md:text-4xl mb-2" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Change Password</h2>
                                <p className="text-gray-500 mt-1 md:mt-2 text-sm md:text-base">Update your account password</p>
                            </div>

                            {errorMsg && (
                                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center text-sm md:text-base">
                                    <FaExclamationTriangle className="mr-2 flex-shrink-0" />
                                    {errorMsg}
                                </div>
                            )}

                            {successMsg && (
                                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 text-green-600 rounded-lg border border-green-200 flex items-center text-sm md:text-base">
                                    <FaCheck className="mr-2 flex-shrink-0" />
                                    {successMsg}
                                </div>
                            )}

                            <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-6">
                                <div className="relative z-0 w-full group">
                                    <div className="relative">
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            id="oldPassword"
                                            name="oldPassword"
                                            className={`block py-2.5 w-full text-sm md:text-base text-gray-900 bg-transparent border-0 border-b-2 ${formik.touched.oldPassword && formik.errors.oldPassword
                                                ? "border-red-300"
                                                : "border-gray-300"
                                                } appearance-none focus:outline-none focus:ring-0 focus:border-[#EC4899] peer`}
                                            placeholder=" "
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.oldPassword}
                                        />
                                        <label
                                            htmlFor="oldPassword"
                                            className="peer-focus:font-medium absolute text-sm md:text-base text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#EC4899] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Current Password
                                        </label>
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#EC4899]"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            tabIndex={-1}
                                            aria-label={showOldPassword ? "Hide password" : "Show password"}
                                        >
                                            {showOldPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </button>
                                    </div>
                                    {formik.touched.oldPassword && formik.errors.oldPassword && (
                                        <ErrorMessage>
                                            <FaExclamationTriangle className="mr-1" size={14} />
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
                                            className={`block py-2.5 w-full text-sm md:text-base text-gray-900 bg-transparent border-0 border-b-2 ${formik.touched.password && formik.errors.password
                                                ? "border-red-300"
                                                : "border-gray-300"
                                                } appearance-none focus:outline-none focus:ring-0 focus:border-[#EC4899] peer`}
                                            placeholder=" "
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.password}
                                        />
                                        <label
                                            htmlFor="password"
                                            className="peer-focus:font-medium absolute text-sm md:text-base text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#EC4899] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            New Password
                                        </label>
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#EC4899]"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            tabIndex={-1}
                                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                                        >
                                            {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </button>
                                    </div>
                                    {formik.touched.password && formik.errors.password && (
                                        <ErrorMessage>
                                            <FaExclamationTriangle className="mr-1" size={14} />
                                            {formik.errors.password}
                                        </ErrorMessage>
                                    )}
                                </div>

                                <SubmitButton
                                    type="submit"
                                    disabled={isLoading || !formik.isValid || !formik.dirty}
                                    className="w-full mt-2 md:mt-4"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Changing...
                                        </>
                                    ) : (
                                        <>
                                            Change Password
                                            <FaLock className="h-4 w-4" />
                                        </>
                                    )}
                                </SubmitButton>
                            </form>
                        </FormContainer>
                    </div>

                    <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
                        <FormContainer>
                            <div className="p-3 md:p-4 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800">Security Tips</h3>
                            </div>
                            <div className="p-3 md:p-4">
                                <ul className="space-y-2 md:space-y-3 text-gray-600 text-sm md:text-base">
                                    <li className="flex items-start">
                                        <FaCheck className="text-green-500 ml-2 mt-0.5 flex-shrink-0" size={14} />
                                        <span>Use a strong password with letters, numbers, and symbols</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheck className="text-green-500 ml-2 mt-0.5 flex-shrink-0" size={14} />
                                        <span>Don't use the same password on multiple sites</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheck className="text-green-500 ml-2 mt-0.5 flex-shrink-0" size={14} />
                                        <span>Change your password regularly every 3-6 months</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheck className="text-green-500 ml-2 mt-0.5 flex-shrink-0" size={14} />
                                        <span>Avoid using personal information in your password</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheck className="text-green-500 ml-2 mt-0.5 flex-shrink-0" size={14} />
                                        <span>Consider using a password manager</span>
                                    </li>
                                </ul>
                            </div>
                        </FormContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}