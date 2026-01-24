import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    KeyRound
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { loginUser, resetPassword } from '../service/auth';

const Login = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState('login');

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
        setCreds(prev => ({ ...prev, [key]: value }));
    };

    const handleResetChange = (key, value) => {
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
        }
    });

    console.log(data)

    // ---------------- RESET PASSWORD ----------------

    const { mutate: resetPasswordMutate, isPending: resetLoading } =
        useMutation({
            mutationFn: () => resetPassword(data?.user?.id, resetPwd.newPassword),

            onSuccess: (data) => {
                setStep('login')
            }
        });

    const handleLogin = () => login();

    const handleResetPassword = () => {
        if (resetPwd.newPassword !== resetPwd.confirmPassword) {
            alert('Passwords do not match');
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
                            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus-within:border-accent">
                                <Mail size={18} className="text-text-muted" />
                                <input
                                    type="email"
                                    value={creds.email}
                                    onChange={(e) =>
                                        handleChange('email', e.target.value)
                                    }
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    placeholder="you@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-text-muted">Password</label>
                            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus-within:border-accent">
                                <Lock size={18} className="text-text-muted" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={creds.password}
                                    onChange={(e) =>
                                        handleChange('password', e.target.value)
                                    }
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={loginLoading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-3 rounded-lg font-semibold"
                        >
                            {loginLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
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
                            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus-within:border-accent">
                                <KeyRound size={18} className="text-text-muted" />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={resetPwd.newPassword}
                                    onChange={(e) =>
                                        handleResetChange('newPassword', e.target.value)
                                    }
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    placeholder="New password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(v => !v)}
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-text-muted">
                                Confirm password
                            </label>
                            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-4 py-3">
                                <Lock size={18} className="text-text-muted" />
                                <input
                                    type="password"
                                    value={resetPwd.confirmPassword}
                                    onChange={(e) =>
                                        handleResetChange('confirmPassword', e.target.value)
                                    }
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleResetPassword}
                            disabled={resetLoading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-3 rounded-lg font-semibold"
                        >
                            {resetLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
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
