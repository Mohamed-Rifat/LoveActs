import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, ArrowRight, Shield, Key, Check } from 'lucide-react';
import 'animate.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Simple OTP Input Component since we can't import external libraries
const OtpInput = ({ value, onChange, numInputs = 6 }) => {
    const inputs = useRef([]);

    const handleChange = (index, val) => {
        const newOtp = value.split('');
        newOtp[index] = val;
        onChange(newOtp.join(''));

        // Move to next input
        if (val && index < numInputs - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-3 my-6">
            {Array.from({ length: numInputs }, (_, index) => (
                <input
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    style={{ borderColor: '#FDE6ED', focusBorderColor: '#F8BBD9' }}
                    onFocus={(e) => e.target.style.borderColor = '#F8BBD9'}
                />
            ))}
        </div>
    );
};

export default function ModernResetPasswordFlow() {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const emailRef = useRef('');
    const baseUrl = 'https://flowers-vert-six.vercel.app/api/user';

    // Step 1: Email form
    const emailFormik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Please enter a valid email address')
                .required('Email is required')
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            setErrorMsg('');

            try {
                emailRef.current = values.email;

                await axios.post(`${baseUrl}/send-otp`, { email: values.email })
                    .then((response) => {
                        if (response.status === 200) {
                            setStep(2);
                            setSuccessMsg('Verification code sent to your email!');
                            console.log('OTP sent successfully');
                        }
                    }).catch((error) => {
                        setErrorMsg(error.response?.data?.error?.ar || 'Failed to send verification code. Please try again.');
                    });
            } catch (error) {
                setErrorMsg('Failed to send verification code. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    });

    // Step 3: New password form
    const passwordFormik = useFormik({
        initialValues: {
            password: ''
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required('New password is required')
                .min(6, 'Password must be at least 6 characters')
                .max(20, 'Password must be at most 20 characters')
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            setErrorMsg('');

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));

                setSuccessMsg('Password reset successfully! You can now login with your new password.');

                // Reset everything after success
                setTimeout(() => {
                    setStep(1);
                    setOtp('');
                    emailFormik.resetForm();
                    passwordFormik.resetForm();
                    setSuccessMsg('');
                }, 3000);

            } catch (error) {
                setErrorMsg('Failed to reset password. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    });

    // Handle OTP verification
    const handleOtpVerification = async () => {
        if (otp.length !== 6) return;

        setIsLoading(true);
        setErrorMsg('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setStep(3);
            setSuccessMsg('Code verified successfully!');

            setTimeout(() => setSuccessMsg(''), 3000);

        } catch (error) {
            setErrorMsg('Invalid verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStepIcon = (stepNumber) => {
        if (step > stepNumber) return <Check className="w-4 h-4" />;
        return stepNumber;
    };

    const getStepColor = (stepNumber) => {
        if (step > stepNumber) return 'bg-green-500';
        if (step === stepNumber) return 'bg-pink-500';
        return 'bg-gray-300';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-25 to-pink-100 flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #FDE6ED 0%, #FFFFFF 50%, #FDE6ED 100%)' }}>
            <div className="relative w-full max-w-md">
                {/* Main container */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden animate__animated animate__bounceInRight">
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(253, 230, 237, 0.4) 0%, transparent 50%, rgba(253, 230, 237, 0.1) 100%)' }}></div>

                    {/* Content */}
                    <div className="relative z-10 ">
                        {/* Progress Steps */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="flex items-center w-full max-w-xs">
                                {/* Step 1 */}
                                <div className="flex items-center flex-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 ${getStepColor(1)}`}>
                                        {getStepIcon(1)}
                                    </div>
                                    <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${step > 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex items-center flex-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 ${getStepColor(2)}`}>
                                        {getStepIcon(2)}
                                    </div>
                                    <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${step > 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                </div>

                                {/* Step 3 */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 ${getStepColor(3)}`}>
                                    {getStepIcon(3)}
                                </div>
                            </div>
                        </div>

                        {/* Success Message */}
                        {successMsg && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 animate-pulse">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-green-700 text-sm font-medium">{successMsg}</span>
                            </div>
                        )}

                        {/* Error Message */}
                        {errorMsg && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <span className="text-red-700 text-sm font-medium">{errorMsg}</span>
                            </div>
                        )}

                        {/* Step 1: Email Input */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #FDE6ED, #F8BBD9)' }}>
                                        <Mail className="w-8 h-8 text-pink-700" />
                                    </div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                                        Forgot Password?
                                    </h1>
                                    <p className="text-gray-600 text-sm">
                                        Enter your email address and we'll send you a verification code
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={emailFormik.values.email}
                                                onChange={emailFormik.handleChange}
                                                onBlur={emailFormik.handleBlur}
                                                className={`w-full px-4 py-3 bg-white/50 border-2 rounded-2xl transition-all duration-300 outline-none ${emailFormik.errors.email && emailFormik.touched.email
                                                    ? 'border-red-300 focus:border-red-500'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    } backdrop-blur-sm`}
                                                style={{ focusBorderColor: '#FDE6ED' }}
                                                onFocus={(e) => e.target.style.borderColor = '#F8BBD9'}
                                                placeholder="Enter your email address"
                                            />
                                        </div>
                                        {emailFormik.errors.email && emailFormik.touched.email && (
                                            <div className="flex items-center gap-2 text-red-500 text-xs">
                                                <AlertCircle className="w-3 h-3" />
                                                {emailFormik.errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={emailFormik.handleSubmit}
                                        disabled={isLoading || !emailFormik.isValid || !emailFormik.dirty}
                                        className="w-full group relative overflow-hidden text-white py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                                        style={{
                                            background: isLoading || !emailFormik.isValid || !emailFormik.dirty
                                                ? '#cbd5e1'
                                                : 'linear-gradient(135deg, #FDE6ED, #F8BBD9)',
                                            color: isLoading || !emailFormik.isValid || !emailFormik.dirty ? '#64748b' : '#7F1D1D'
                                        }}
                                    >
                                        <div className="relative flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="w-5 h-5" />
                                                    Send Verification Code
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #FDE6ED, #F8BBD9)' }}>
                                        <Key className="w-8 h-8 text-pink-700" />
                                    </div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                                        Check Your Email
                                    </h1>
                                    <p className="text-gray-600 text-sm">
                                        We've sent a 6-digit verification code to {emailRef.current}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <OtpInput value={otp} onChange={setOtp} />

                                    <button
                                        onClick={handleOtpVerification}
                                        disabled={isLoading || otp.length !== 6}
                                        className="w-full group relative overflow-hidden text-white py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                                        style={{
                                            background: isLoading || otp.length !== 6
                                                ? '#cbd5e1'
                                                : 'linear-gradient(135deg, #FDE6ED, #F8BBD9)',
                                            color: isLoading || otp.length !== 6 ? '#64748b' : '#7F1D1D'
                                        }}
                                    >
                                        <div className="relative flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    Verify Code
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                </>
                                            )}
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        className="w-full text-sm hover:transition-colors duration-300"
                                        style={{ color: '#F8BBD9' }}
                                        onMouseEnter={(e) => e.target.style.color = '#BE185D'}
                                        onMouseLeave={(e) => e.target.style.color = '#F8BBD9'}
                                        onClick={() => setStep(1)}
                                    >
                                        Didn't receive the code? Try again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #FDE6ED, #F8BBD9)' }}>
                                        <Shield className="w-8 h-8 text-pink-700" />
                                    </div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                                        Set New Password
                                    </h1>
                                    <p className="text-gray-600 text-sm">
                                        Enter your new password to secure your account
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={passwordFormik.values.password}
                                                onChange={passwordFormik.handleChange}
                                                onBlur={passwordFormik.handleBlur}
                                                className={`w-full px-4 py-3 pr-12 bg-white/50 border-2 rounded-2xl transition-all duration-300 outline-none ${passwordFormik.errors.password && passwordFormik.touched.password
                                                    ? 'border-red-300 focus:border-red-500'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    } backdrop-blur-sm`}
                                                style={{ focusBorderColor: '#FDE6ED' }}
                                                onFocus={(e) => e.target.style.borderColor = '#F8BBD9'}
                                                placeholder="Enter your new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors"
                                                style={{ color: '#F8BBD9' }}
                                                onMouseEnter={(e) => e.target.style.color = '#BE185D'}
                                                onMouseLeave={(e) => e.target.style.color = '#F8BBD9'}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        {passwordFormik.errors.password && passwordFormik.touched.password && (
                                            <div className="flex items-center gap-2 text-red-500 text-xs">
                                                <AlertCircle className="w-3 h-3" />
                                                {passwordFormik.errors.password}
                                            </div>
                                        )}

                                        {/* Password strength indicator */}
                                        {passwordFormik.values.password && (
                                            <div className="space-y-2">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4].map((level) => (
                                                        <div
                                                            key={level}
                                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${passwordFormik.values.password.length >= level * 2
                                                                ? passwordFormik.values.password.length >= 8
                                                                    ? 'bg-green-500'
                                                                    : passwordFormik.values.password.length >= 6
                                                                        ? 'bg-yellow-500'
                                                                        : 'bg-pink-400'
                                                                : 'bg-gray-200'
                                                                }`}
                                                        ></div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Password strength: {' '}
                                                    <span className={
                                                        passwordFormik.values.password.length >= 8
                                                            ? 'text-green-600 font-semibold'
                                                            : passwordFormik.values.password.length >= 6
                                                                ? 'text-yellow-600 font-semibold'
                                                                : 'font-semibold'
                                                    } style={{ color: passwordFormik.values.password.length < 6 ? '#F8BBD9' : undefined }}>
                                                        {passwordFormik.values.password.length >= 8
                                                            ? 'Strong'
                                                            : passwordFormik.values.password.length >= 6
                                                                ? 'Medium'
                                                                : 'Weak'
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={passwordFormik.handleSubmit}
                                        disabled={isLoading || !passwordFormik.isValid || !passwordFormik.dirty}
                                        className="w-full group relative overflow-hidden text-white py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                                        style={{
                                            background: isLoading || !passwordFormik.isValid || !passwordFormik.dirty
                                                ? '#cbd5e1'
                                                : 'linear-gradient(135deg, #FDE6ED, #F8BBD9)',
                                            color: isLoading || !passwordFormik.isValid || !passwordFormik.dirty ? '#64748b' : '#7F1D1D'
                                        }}
                                    >
                                        <div className="relative flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Updating Password...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-5 h-5" />
                                                    Set New Password
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Back to login link */}
                        <div className="text-center mt-6">
                            <Link to="/login"
                                type="button"
                                className="text-sm transition-colors duration-300"
                                style={{ color: '#F8BBD9' }}
                                onMouseEnter={(e) => e.target.style.color = '#BE185D'}
                                onMouseLeave={(e) => e.target.style.color = '#F8BBD9'}
                            >
                                Remember your password? Sign in
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Security tips */}
                {step === 3 && (
                    <div className="mt-6 p-4 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F8BBD9' }} />
                            <div className="text-sm text-gray-600">
                                <p className="font-medium mb-1">Security Tips:</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• Use a mix of letters, numbers, and symbols</li>
                                    <li>• Make it at least 8 characters long</li>
                                    <li>• Don't reuse old passwords</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}