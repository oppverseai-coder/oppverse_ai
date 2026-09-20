'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Target, 
  ShieldCheck, 
  Compass, 
  FileCheck2, 
  Briefcase, 
  GraduationCap, 
  Coins, 
  Globe, 
  Mic, 
  Plane, 
  Rocket, 
  CheckCircle2, 
  ChevronDown, 
  Clock, 
  Bookmark, 
  Menu, 
  X,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const universes = [
    { name: 'Jobs & Internships', icon: Briefcase, count: '3,400+ Active' },
    { name: 'Fellowships & Leadership', icon: Compass, count: '850+ Open' },
    { name: 'Scholarships & Study', icon: GraduationCap, count: '1,200+ Funded' },
    { name: 'Grants & Funding', icon: Coins, count: '₦4.2B+ Pool' },
    { name: 'Conferences & Summits', icon: Globe, count: '420+ Events' },
    { name: 'Travel & Exchanges', icon: Plane, count: '190+ Programs' },
    { name: 'Accelerators & Pitch', icon: Rocket, count: '310+ Cohorts' },
    { name: 'Speaking & Research', icon: Mic, count: '260+ Calls' },
  ];

  const features = [
    {
      icon: Target,
      title: 'Matches Built Around You',
      desc: 'Your experience, goals, location, and verified eligibility shape every opportunity in your universe.',
    },
    {
      icon: ShieldCheck,
      title: 'Eligibility Before Effort',
      desc: 'Oppverse screens geographic, citizenship, and academic restrictions before you waste time on an application.',
    },
    {
      icon: Compass,
      title: 'One Opportunity Universe',
      desc: 'Move across careers, funding, learning, travel, and speaking without fragmented searches across 50 websites.',
    },
    {
      icon: FileCheck2,
      title: 'From Discovery to Decision',
      desc: 'Save, compare, tailor materials, and track every application in one calm, focused workspace.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Define your direction',
      desc: 'Create a focused professional profile for who you are and where you want to go next.',
    },
    {
      num: '02',
      title: 'See ranked opportunities',
      desc: 'Review live opportunities ranked by relevance, verified eligibility, deadline urgency, and strategic fit.',
    },
    {
      num: '03',
      title: 'Act with context',
      desc: 'Understand why each match fits, tailor your CV, and track your pipeline through to acceptance.',
    },
  ];

  const faqs = [
    {
      q: 'What kinds of opportunities does Oppverse cover?',
      a: 'Oppverse covers 8 core universes: Jobs, Fellowships, Scholarships, Grants, Conferences, Travel programs, Accelerators, and Speaking/Research opportunities across global and African ecosystems.',
    },
    {
      q: 'How does the 5-layer Explainable Matching Engine work?',
      a: 'Oppverse evaluates opportunities across 5 distinct dimensions: Eligibility Fit, Skill Fit, Goal Alignment, Financial/Funding Coverage, and Application Effort, giving you an exact percentage match with explainable bullet points.',
    },
    {
      q: 'Can I use more than one professional persona?',
      a: 'Yes. You can maintain multiple opportunity personas (e.g. your professional role, your founder profile, and your speaker profile) and switch universes instantly.',
    },
    {
      q: 'Does Oppverse charge application fees?',
      a: 'No. Oppverse is an opportunity intelligence platform. We screen and flag fraudulent listings with scam detection to ensure only legitimate opportunities appear in your feed.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/brand/oppverse-icon-dark.png" 
              alt="Oppverse AI" 
              className="w-8 h-8 object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform" 
            />
            <span className="font-display font-semibold text-xl tracking-tight text-white">
              Oppverse AI
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#universes" className="hover:text-white transition-colors">Universes</a>
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Desktop Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all"
            >
              Sign In
            </Link>
            <Link 
              href="/app" 
              className="px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              Enter Oppverse <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-3 text-sm font-medium text-zinc-400">
              <a href="#universes" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Universes</a>
              <a href="#platform" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Platform</a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">How It Works</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">FAQ</a>
            </nav>
            <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2.5">
              <Link 
                href="/login" 
                className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold bg-white text-zinc-950"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-zinc-400" />
            <span>AI-Powered Opportunity Intelligence</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-white leading-[1.15]">
            Opportunity should find <span className="text-zinc-400">the right person.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Oppverse discovers and ranks jobs, fellowships, scholarships, grants, and global programs around who you are, what you are eligible for, and where you want to go.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              Build Your Opportunity Profile <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/app" 
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              Explore Live Feed
            </Link>
          </div>
        </div>

        {/* 3. Live Product Preview Cards Showcase */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/80 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                <span className="text-xs font-mono text-zinc-500 ml-2">oppverse.ai/universe</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 5-Layer Matching Live
              </span>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Fellowship</span>
                  <span className="text-xs font-bold text-emerald-400">92% Match</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">Mozilla Tech & Society Fellowship 2027</h3>
                <p className="text-xs text-zinc-400 line-clamp-2">12-month fully funded global fellowship for open-source AI and public interest technologists.</p>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>$85,000 Stipend</span>
                  <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Eligible</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Grant</span>
                  <span className="text-xs font-bold text-emerald-400">89% Match</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">The Citi Foundation Global Innovation Challenge</h3>
                <p className="text-xs text-zinc-400 line-clamp-2">Direct funding support up to $500,000 for high-impact social and tech solutions in emerging markets.</p>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>$500,000 Award</span>
                  <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Eligible</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Speaking</span>
                  <span className="text-xs font-bold text-cyan-300">86% Match</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">Keynote Speaker: Global AI World Congress</h3>
                <p className="text-xs text-zinc-400 line-clamp-2">London summit keynote speaker opportunity with full travel, VIP pass, and 5-star hotel covered.</p>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Flights + VIP Pass</span>
                  <span className="text-cyan-300 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 18d left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Opportunity Universes Grid */}
      <section id="universes" className="py-20 border-t border-zinc-900 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">The Taxonomy</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              One Profile Across Every Opportunity Universe
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Oppverse unifies fragmented directories, newsletters, and institutional portals into 8 structured categories.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {universes.map((u) => {
              const Icon = u.icon;
              return (
                <div 
                  key={u.name}
                  className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">{u.name}</h3>
                    <p className="text-[11px] font-mono text-zinc-500 mt-0.5">{u.count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Platform Features Bento */}
      <section id="platform" className="py-20 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Core Intelligence</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              A Clearer Way to Find What Is Worth Pursuing
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Oppverse replaces blind searching with deterministic eligibility, explainable matching, and application tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div 
                  key={f.title}
                  className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold font-display text-white">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. How It Works Steps */}
      <section id="how-it-works" className="py-20 border-t border-zinc-900 bg-zinc-950/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">The Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              From Profile to Priority in Three Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div 
                key={s.num}
                className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3"
              >
                <span className="text-2xl font-bold font-display text-zinc-600">{s.num}</span>
                <h3 className="text-sm font-bold text-white">{s.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section id="faq" className="py-20 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Questions & Answers</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={faq.q}
                  className="rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-zinc-200"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Stop searching everywhere.<br />Start seeing what fits.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Your next serious opportunity may already be open. Build your profile once and let Oppverse find it.
          </p>
          <div className="pt-2">
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs sm:text-sm shadow-xl transition-all"
            >
              Enter Oppverse <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/brand/oppverse-icon-dark.png" alt="Oppverse" className="w-5 h-5 object-contain" />
            <span className="font-semibold text-zinc-300">Oppverse AI</span>
            <span>· © 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/app" className="hover:text-zinc-300">Universe</Link>
            <Link href="/discover" className="hover:text-zinc-300">Discover</Link>
            <Link href="/login" className="hover:text-zinc-300">Sign In</Link>
            <Link href="/signup" className="hover:text-zinc-300">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
