'use client';
import Link from 'next/link';
import { ArrowRight, Bookmark, BriefcaseBusiness, Check, ChevronDown, CircleDollarSign, Compass, Earth, FileCheck2, MapPin, Menu, Search, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';
import styles from './landing.module.css';

const universes = ['Jobs', 'Fellowships', 'Scholarships', 'Grants', 'Conferences', 'Speaking', 'Travel'];
const universeIcons = [BriefcaseBusiness, Users, Bookmark, CircleDollarSign, Earth, Users, MapPin];
const features = [
  { icon: Target, title: 'Matches built around you', copy: 'Your experience, goals, location, and eligibility shape every opportunity you see.', art: '/landing/figma/asset-11.svg' },
  { icon: ShieldCheck, title: 'Eligibility before effort', copy: 'Oppverse checks the details that matter before you spend time on an application.', art: '/landing/figma/asset-13.svg' },
  { icon: Compass, title: 'One opportunity universe', copy: 'Move across careers, funding, learning, travel, and speaking without fragmented searches.', art: '/landing/figma/asset-19.svg' },
  { icon: FileCheck2, title: 'From discovery to decision', copy: 'Save, compare, pursue, and track each opportunity from one calm workspace.', art: '/landing/figma/asset-20.svg' },
];
const faqs = [
  ['What kinds of opportunities does Oppverse cover?', 'Jobs, fellowships, scholarships, grants, conferences, speaking opportunities, travel programs, and accelerators.'],
  ['How does matching work?', 'Oppverse compares each opportunity with your active profile, including skills, goals, experience, location, and eligibility.'],
  ['Can I use more than one professional profile?', 'Yes. You can switch between distinct opportunity personas and receive a different ranked universe for each one.'],
  ['Does Oppverse submit applications for me?', 'Oppverse helps you discover, evaluate, save, and track opportunities. You remain in control of every application.'],
];

export default function LandingPage() {
  return <div className={styles.page}>
    <header className={styles.navWrap}><nav className={styles.nav} aria-label="Primary navigation">
      <Link href="/" className={styles.brand}><span className={styles.brandMark}>O</span><span>Oppverse AI</span></Link>
      <div className={styles.navLinks}><a href="#platform">Platform <ChevronDown size={12} /></a><a href="#how">How it works</a><a href="#faq">FAQ</a></div>
      <div className={styles.navActions}><Link href="/app" className={styles.textButton}>Sign in</Link><Link href="/app" className={styles.lightButton}>Enter Oppverse</Link></div>
      <button className={styles.mobileMenu} aria-label="Open menu"><Menu size={18} /></button>
    </nav></header>
    <main>
      <section className={styles.hero}><div className={styles.heroGlow} aria-hidden="true" /><div className={styles.heroContent}>
        <div className={styles.announcement}><span>Your opportunity universe is ready</span><Link href="/app">Explore it <ArrowRight size={12} /></Link></div>
        <h1>Opportunity should find <span>the right person.</span></h1>
        <p>Oppverse discovers and ranks jobs, fellowships, grants, conferences, speaking opportunities, and global programs around who you are and where you are going.</p>
        <div className={styles.heroActions}><Link href="/app" className={styles.lightButton}>Build your opportunity profile</Link><a href="#platform" className={styles.darkButton}>See how it works</a></div>
      </div><div className={styles.mockupStage}><div className={styles.mockupGlow} aria-hidden="true" /><div className={styles.mockupFrame}><img src="/landing/figma/product-mockup.png" alt="Opportunity intelligence dashboard preview" /></div><div className={styles.mockupFade} aria-hidden="true" /></div></section>
      <section className={styles.universes} aria-label="Opportunity types"><p>One profile across every opportunity universe</p><div>{universes.map((universe,index)=>{const Icon=universeIcons[index];return <span key={universe}><Icon size={18}/>{universe}</span>})}</div></section>
      <section className={styles.section} id="platform"><div className={styles.sectionHeading}><span>Opportunity intelligence</span><h2>A clearer way to find what is worth pursuing.</h2><p>Oppverse replaces scattered searches and generic recommendations with one ranked, explainable view of what matters now.</p></div>
        <div className={styles.bento}>{features.map((feature,index)=>{const Icon=feature.icon;return <article className={`${styles.featureCard} ${index===0||index===3?styles.featureWide:''}`} key={feature.title}><div className={styles.featureCopy}><span className={styles.iconBox}><Icon size={18}/></span><h3>{feature.title}</h3><p>{feature.copy}</p></div><div className={styles.featureArt}><img src={feature.art} alt=""/></div></article>})}</div>
      </section>
      <section className={styles.stepsSection} id="how"><div className={styles.sectionHeading}><span>How Oppverse works</span><h2>From profile to priority in three steps.</h2></div><div className={styles.steps}>
        <article><strong>01</strong><div><h3>Define your direction</h3><p>Create a focused professional profile for the kind of opportunity you want next.</p></div></article>
        <article><strong>02</strong><div><h3>See ranked opportunities</h3><p>Review opportunities ordered by relevance, eligibility, deadline, and strategic fit.</p></div></article>
        <article><strong>03</strong><div><h3>Act with context</h3><p>Understand why each match matters, then save, pursue, and track it without losing momentum.</p></div></article>
      </div><div className={styles.risingVisual}><div className={styles.searchDemo}><Search size={18}/><span>Senior product marketing opportunities with verified Nigerian eligibility</span><kbd>28 matches</kbd></div><img src="/landing/figma/asset-04.svg" alt="Opportunity intelligence visualization"/></div></section>
      <section className={styles.testimonialSection}><div className={styles.quote}><Sparkles size={22}/><blockquote>“The useful part is not seeing more opportunities. It is immediately understanding which ones deserve your attention.”</blockquote><div className={styles.person}><img src="/landing/figma/source-image-3.jpeg" alt="Oppverse user"/><div><strong>Built for ambitious professionals</strong><span>Careers, funding, learning, and global visibility</span></div></div></div></section>
      <section className={styles.pricingSection}><div className={styles.sectionHeading}><span>Start with your profile</span><h2>One place for every opportunity that could move you forward.</h2></div><div className={styles.planCard}><div><span>Oppverse access</span><h3>Build your opportunity universe</h3><p>Set up your profile and explore personalized opportunities across every supported category.</p></div><ul><li><Check size={15}/>Personalized ranking</li><li><Check size={15}/>Eligibility context</li><li><Check size={15}/>Saved opportunities</li><li><Check size={15}/>Application tracking</li></ul><Link href="/app" className={styles.lightButton}>Enter Oppverse <ArrowRight size={15}/></Link></div></section>
      <section className={styles.faqSection} id="faq"><div className={styles.sectionHeading}><span>Questions</span><h2>Everything you need to know.</h2></div><div className={styles.faqList}>{faqs.map(([question,answer])=><details key={question}><summary>{question}<ChevronDown size={16}/></summary><p>{answer}</p></details>)}</div></section>
      <section className={styles.cta}><div className={styles.ctaGlow} aria-hidden="true"/><div><span>Oppverse AI</span><h2>Stop searching everywhere.<br/>Start seeing what fits.</h2><p>Your next serious opportunity may already be open.</p><div className={styles.heroActions}><Link href="/app" className={styles.lightButton}>Build your profile</Link><a href="#platform" className={styles.darkButton}>Explore the platform</a></div></div></section>
    </main>
    <footer className={styles.footer}><div className={styles.footerTop}><Link href="/" className={styles.brand}><span className={styles.brandMark}>O</span><span>Oppverse AI</span></Link><div><strong>Product</strong><Link href="/app">Opportunity Universe</Link><Link href="/discover">Discover</Link></div><div><strong>Workspace</strong><Link href="/missions">Missions</Link><Link href="/applications">Applications</Link></div><div><strong>Account</strong><Link href="/profile">Profile</Link><Link href="/saved">Saved opportunities</Link></div></div><div className={styles.footerBottom}><span>© 2026 Oppverse AI</span><span>Opportunity intelligence, designed around you.</span></div></footer>
  </div>;
}
