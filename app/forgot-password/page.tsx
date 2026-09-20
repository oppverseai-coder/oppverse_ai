'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your account email.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setIsLoading(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send recovery email.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <img src="/brand/oppverse-icon-dark.png" alt="Oppverse AI" className="w-9 h-9 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform" />
            <span className="font-display font-semibold text-2xl tracking-tight text-white">
              Oppverse AI
            </span>
          </Link>
          <h1 className="text-xl font-bold font-display text-white pt-2">
            Reset your password
          </h1>
          <p className="text-xs text-zinc-400">
            Enter your email and we will send you a secure recovery link.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Recovery link dispatched</h3>
                <p className="text-xs text-zinc-400">
                  If an account exists for <span className="text-zinc-200 font-medium">{email}</span>, you will receive password reset instructions.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Email Address</label>
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Link...
                  </>
                ) : (
                  <>
                    Send Recovery Link <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}