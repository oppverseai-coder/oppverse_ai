'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function SignupPage() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      // If user created, route directly into onboarding setup
      router.push('/onboarding');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create account. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <img src="/brand/oppverse-icon-dark.png" alt="Oppverse AI" className="w-9 h-9 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform" />
            <span className="font-display font-semibold text-2xl tracking-tight text-white">
              Oppverse AI
            </span>
          </Link>
          <h1 className="text-xl font-bold font-display text-white pt-2">
            Create your account
          </h1>
          <p className="text-xs text-zinc-400">
            Join Oppverse to discover matched jobs, fellowships, grants & missions.
          </p>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-805 border border-zinc-800 hover:border-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">or with email</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tomide Williams"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-zinc-500 text-white text-xs outline-none transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Work / Personal Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-zinc-500 text-white text-xs outline-none transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-zinc-500 text-white text-xs outline-none transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Setting Up...
                </>
              ) : (
                <>
                  Create Account & Continue <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}