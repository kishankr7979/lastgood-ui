import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    KeyRound,
    AlertCircle,
    Activity,
    ArrowRight,
    Clock
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { loginUser, resetPassword } from '../service/auth';

const timelineSteps = [
    {
        time: "14:15:32",
        title: "Incident Detected",
        desc: "Stripe API webhook failure. Server returned 500.",
        colorClass: "border-red-500/50 bg-red-950/20 text-red-400"
    },
    {
        time: "14:15:45",
        title: "Root Cause Identified",
        desc: "Regression schema change detected in PR #421.",
        colorClass: "border-amber-500/50 bg-amber-950/20 text-amber-400"
    },
    {
        time: "14:16:01",
        title: "Locating Last Good State",
        desc: "Found target snapshot db_replica_1402.",
        colorClass: "border-sky-500/50 bg-sky-950/20 text-sky-400"
    },
    {
        time: "14:16:30",
        title: "System Restored",
        desc: "State rewound. 200 OK webhook retry success.",
        colorClass: "border-emerald-500/50 bg-emerald-950/20 text-emerald-400"
    }
];

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

    // Timeline interactive index state (defaults to completed healthy step)
    const [activeIndex, setActiveIndex] = useState(3);

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
        <div className="min-h-screen bg-bg-primary text-text-primary flex relative overflow-hidden font-sans">
            
            {/* LEFT PANEL: Minimal timeline observability visualization */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-between p-16 relative overflow-hidden border-r border-white/5 bg-[#030611]">
                
                {/* Subtle grids & ambient glow */}
                <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

                {/* Left Panel Logo */}
                <div className="relative z-10 flex items-center gap-2.5">
                    <Activity className="text-accent" size={18} />
                    <span className="text-base font-bold tracking-tight text-white">LastGood</span>
                </div>

                {/* Vertical Timeline */}
                <div className="relative z-10 my-auto max-w-sm space-y-12">
                    <div className="space-y-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-accent/80 font-semibold">Incident Rewind</span>
                        <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                            Rewind production state. Identify anomalies instantly.
                        </h2>
                    </div>

                    <div className="relative pl-6 space-y-8 border-l border-white/10">
                        {timelineSteps.map((s, idx) => {
                            const isActive = idx <= activeIndex;
                            return (
                                <div 
                                    key={idx} 
                                    className={`relative transition-all duration-300 ${
                                        isActive ? 'opacity-100' : 'opacity-30'
                                    }`}
                                >
                                    {/* Timeline Node Dot */}
                                    <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 bg-[#030611] ${
                                        isActive ? s.colorClass.split(' ')[0] : 'border-white/15'
                                    }`} />
                                    
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-text-muted">{s.time}</span>
                                            <span className="text-xs font-semibold text-white">{s.title}</span>
                                        </div>
                                        <p className="text-xs text-text-secondary font-light leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Timeline slider control */}
                    <div className="space-y-2 pt-4">
                        <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
                            <span>Drag to rewind state</span>
                            <span className="text-white flex items-center gap-1">
                                <Clock size={10} className="text-accent" />
                                {timelineSteps[activeIndex].title}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="3"
                            value={activeIndex}
                            onChange={(e) => setActiveIndex(parseInt(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none"
                        />
                    </div>
                </div>

                {/* Footer brand note */}
                <div className="relative z-10 text-[11px] text-text-muted font-mono">
                    LastGood Telemetry System &copy; 2026
                </div>
            </div>

            {/* RIGHT PANEL: Minimal Credentials Section */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 bg-black/5">
                {/* ambient mobile backdrop glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[90px] pointer-events-none lg:hidden" />

                <div className="w-full max-w-[360px] space-y-8">
                    {/* Header */}
                    <div className="text-center lg:text-left space-y-2">
                        {/* Logo visible only on mobile */}
                        <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
                            <Activity className="text-accent" size={18} />
                            <span className="text-base font-bold tracking-tight text-white">LastGood</span>
                        </div>

                        <h1 className="text-xl font-semibold tracking-tight text-white">
                            {step === 'login'
                                ? 'Sign in to LastGood'
                                : 'Reset your password'}
                        </h1>

                        <p className="text-text-muted text-xs leading-relaxed">
                            {step === 'login'
                                ? 'Access your dashboard and recover system states.'
                                : 'Provide your new security credentials below.'}
                        </p>
                    </div>

                    {/* LOGIN FORM */}
                    {step === 'login' && (
                        <div className="space-y-4.5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-text-secondary">Email</label>
                                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                    <Mail size={15} className="text-text-muted shrink-0" />
                                    <input
                                        type="email"
                                        value={creds.email}
                                        onChange={(e) =>
                                            handleChange('email', e.target.value)
                                        }
                                        className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted"
                                        placeholder="name@company.com"
                                        disabled={loginLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-text-secondary">Password</label>
                                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                    <Lock size={15} className="text-text-muted shrink-0" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={creds.password}
                                        onChange={(e) =>
                                            handleChange('password', e.target.value)
                                        }
                                        className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted"
                                        placeholder="••••••••"
                                        disabled={loginLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        disabled={loginLoading}
                                        className="text-text-muted hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {validationError && (
                                <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                                    <AlertCircle size={14} className="shrink-0" />
                                    <span>{validationError}</span>
                                </div>
                            )}

                            <button
                                onClick={handleLogin}
                                disabled={loginLoading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-2.5 rounded-lg text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-all active:scale-[0.985] text-white shadow-lg shadow-accent/10"
                            >
                                {loginLoading ? (
                                    <>
                                        <Loader2 className="animate-spin text-white" size={14} />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={13} className="ml-0.5" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* RESET PASSWORD FORM */}
                    {step === 'reset' && (
                        <div className="space-y-4.5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-text-secondary">New Password</label>
                                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                    <KeyRound size={15} className="text-text-muted shrink-0" />
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={resetPwd.newPassword}
                                        onChange={(e) =>
                                            handleResetChange('newPassword', e.target.value)
                                        }
                                        className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted"
                                        placeholder="New password (min 6 characters)"
                                        disabled={resetLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(v => !v)}
                                        disabled={resetLoading}
                                        className="text-text-muted hover:text-white transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-text-secondary">Confirm Password</label>
                                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                    <Lock size={15} className="text-text-muted shrink-0" />
                                    <input
                                        type="password"
                                        value={resetPwd.confirmPassword}
                                        onChange={(e) =>
                                            handleResetChange('confirmPassword', e.target.value)
                                        }
                                        className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted"
                                        placeholder="Confirm password"
                                        disabled={resetLoading}
                                    />
                                </div>
                            </div>

                            {validationError && (
                                <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                                    <AlertCircle size={14} className="shrink-0" />
                                    <span>{validationError}</span>
                                </div>
                            )}

                            <button
                                onClick={handleResetPassword}
                                disabled={resetLoading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-2.5 rounded-lg text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-all active:scale-[0.985] text-white shadow-lg shadow-accent/10"
                            >
                                {resetLoading ? (
                                    <>
                                        <Loader2 className="animate-spin text-white" size={14} />
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
        </div>
    );
};

export default Login;

