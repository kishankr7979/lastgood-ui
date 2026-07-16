import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    KeyRound,
    AlertCircle
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { loginUser, resetPassword } from '../service/auth';

const Login = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState('login');
    const [validationError, setValidationError] = useState('');

    const [creds, setCreds] = useState({
        email: '',
        password: ''
    });

    const [resetPwd, setResetPwd] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleChange = (key, value) => {
        setValidationError('');
        setCreds(prev => ({ ...prev, [key]: value }));
    };

    const handleResetChange = (key, value) => {
        setValidationError('');
        setResetPwd(prev => ({ ...prev, [key]: value }));
    };

    // ---------------- LOGIN ----------------

    const { mutate: login, isPending: loginLoading, data } = useMutation({
        mutationFn: () => loginUser(creds.email, creds.password),

        onSuccess: (data) => {
            const tempPassRestted = data?.user?.temp_pwd_reset;


            if (!tempPassRestted) {

                setStep('reset');
                return;
            }

            localStorage.setItem('authToken', data?.token)

            navigate('/rewind');
        },
        onError: (err) => {
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Invalid email or password";
            setValidationError(errMsg);
        }
    });

    console.log(data)

    // ---------------- RESET PASSWORD ----------------

    const { mutate: resetPasswordMutate, isPending: resetLoading } =
        useMutation({
            mutationFn: () => resetPassword(data?.user?.id, resetPwd.newPassword),

            onSuccess: (data) => {
                setStep('login')
            },
            onError: (err) => {
                const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to reset password";
                setValidationError(errMsg);
            }
        });

    const handleLogin = () => {
        setValidationError('');
        if (!creds.email.trim()) {
            setValidationError('Email address is required.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(creds.email)) {
            setValidationError('Please enter a valid email address.');
            return;
        }
        if (!creds.password) {
            setValidationError('Password is required.');
            return;
        }
        if (creds.password.length < 6) {
            setValidationError('Password must be at least 6 characters long.');
            return;
        }
        login();
    };

    const handleResetPassword = () => {
        setValidationError('');
        if (!resetPwd.newPassword) {
            setValidationError('New password is required.');
            return;
        }
        if (resetPwd.newPassword.length < 6) {
            setValidationError('New password must be at least 6 characters long.');
            return;
        }
        if (resetPwd.newPassword !== resetPwd.confirmPassword) {
            setValidationError('Passwords do not match.');
            return;
        }

        resetPasswordMutate();
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4 relative overflow-hidden">

            {/* ambient glow */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[140px]" />

            <div className="w-full max-w-md bg-gradient-card border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
                {/* header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {step === 'login'
                            ? 'Sign in to LastGood'
                            : 'Reset your password'}
                    </h1>

                    <p className="text-text-secondary mt-2 text-sm">
                        {step === 'login'
                            ? 'Rewind production. Understand failures instantly.'
                            : 'You’re using a temporary password. Please set a new one.'}
                    </p>
                </div>

                {/* LOGIN STEP */}
                {step === 'login' && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-text-muted">Email</label>
                            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-all font-sans">
                                <Mail size={18} className="text-text-muted" />
                                <input
                                    type="email"
                                    value={creds.email}
                                    onChange={(e) =>
                                        handleChange('email', e.target.value)
                                    }
                                    className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/20 disabled:text-text-muted"
                                    placeholder="you@company.com"
                                    disabled={loginLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-text-muted">Password</label>
                            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-all font-sans">
                                <Lock size={18} className="text-text-muted" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={creds.password}
                                    onChange={(e) =>
                                        handleChange('password', e.target.value)
                                    }
                                    className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/20 disabled:text-text-muted"
                                    placeholder="••••••••"
                                    disabled={loginLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    disabled={loginLoading}
                                    className="text-text-muted hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {validationError && (
                            <div className="bg-status-error/10 border border-status-error/20 text-status-error text-xs p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{validationError}</span>
                            </div>
                        )}

                        <button
                            onClick={handleLogin}
                            disabled={loginLoading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity active:scale-[0.98] transition-transform text-white shadow-lg shadow-accent/20"
                        >
                            {loginLoading ? (
                                <>
                                    <Loader2 className="animate-spin text-white" size={18} />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                )}

                {/* RESET PASSWORD STEP */}
                {step === 'reset' && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-text-muted">New password</label>
                            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-all font-sans">
                                <KeyRound size={18} className="text-text-muted" />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={resetPwd.newPassword}
                                    onChange={(e) =>
                                        handleResetChange('newPassword', e.target.value)
                                    }
                                    className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/20 disabled:text-text-muted"
                                    placeholder="New password"
                                    disabled={resetLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(v => !v)}
                                    disabled={resetLoading}
                                    className="text-text-muted hover:text-white transition-colors"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-text-muted">Confirm password</label>
                            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-all font-sans">
                                <Lock size={18} className="text-text-muted" />
                                <input
                                    type="password"
                                    value={resetPwd.confirmPassword}
                                    onChange={(e) =>
                                        handleResetChange('confirmPassword', e.target.value)
                                    }
                                    className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/20 disabled:text-text-muted"
                                    placeholder="Confirm password"
                                    disabled={resetLoading}
                                />
                            </div>
                        </div>

                        {validationError && (
                            <div className="bg-status-error/10 border border-status-error/20 text-status-error text-xs p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{validationError}</span>
                            </div>
                        )}

                        <button
                            onClick={handleResetPassword}
                            disabled={resetLoading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity active:scale-[0.98] transition-transform text-white shadow-lg shadow-accent/20"
                        >
                            {resetLoading ? (
                                <>
                                    <Loader2 className="animate-spin text-white" size={18} />
                                    Updating...
                                </>
                            ) : (
                                'Update password'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
