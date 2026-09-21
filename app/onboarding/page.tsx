'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Compass, FileText, Globe2, Loader2, Target, Upload, UserRound } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { completeUserOnboarding } from '@/lib/supabase/db';
import { OpportunityCategory, UserProfile } from '@/lib/types';
import { countries } from '@/lib/countries';

const segments = [
  ['Early-Career Professional', 'Career-launching roles and professional opportunities'],
  ['Student or Graduate', 'Scholarships, internships, research and graduate opportunities'],
  ['Mid-Career Professional', 'Leadership roles, fellowships and professional growth'],
  ['Founder or Entrepreneur', 'Funding, accelerators and founder programmes'],
  ['Researcher or Academic', 'Research funding, fellowships and calls for papers'],
  ['Creative or Independent', 'Residencies, grants, awards and international programmes'],
] as const;

const universes: OpportunityCategory[] = ['Jobs', 'Fellowships', 'Scholarships', 'Grants', 'Conferences', 'Travel', 'Accelerators', 'Speaking', 'Competitions'];
const careerLevels: UserProfile['careerLevel'][] = ['Student', 'Early-Career', 'Mid-Career', 'Senior', 'Executive', 'Founder'];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');
  const [city, setCity] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [careerLevel, setCareerLevel] = useState<UserProfile['careerLevel']>('Early-Career');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [segment, setSegment] = useState('Early-Career Professional');
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [selectedUniverses, setSelectedUniverses] = useState<OpportunityCategory[]>(['Jobs', 'Fellowships']);
  const [goalsText, setGoalsText] = useState('');
  const [remotePreference, setRemotePreference] = useState<UserProfile['remotePreference']>('Any');
  const [relocationPreference, setRelocationPreference] = useState(false);
  const [skillsText, setSkillsText] = useState('');
  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [personaName, setPersonaName] = useState('');

  useEffect(() => {
    if (user) setFullName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
  }, [user]);

  useEffect(() => {
    if (!personaName) setPersonaName(targetRole || segment);
  }, [targetRole, segment, personaName]);

  const goals = useMemo(() => goalsText.split('\n').map((value) => value.trim()).filter(Boolean), [goalsText]);
  const skills = useMemo(() => skillsText.split(',').map((value) => value.trim()).filter(Boolean), [skillsText]);

  const toggleUniverse = (universe: OpportunityCategory) => setSelectedUniverses((current) => current.includes(universe) ? current.filter((item) => item !== universe) : [...current, universe]);

  const next = () => {
    setError('');
    if (step === 1 && (!fullName || !countryOfResidence || !citizenship)) return setError('Add your name, country of residence and citizenship to continue.');
    if (step === 2 && !targetRole.trim()) return setError('Tell Oppverse the role or direction you want to pursue.');
    if (step === 3 && selectedUniverses.length === 0) return setError('Select at least one opportunity universe.');
    if (step === 4 && goals.length === 0) return setError('Add at least one goal so Oppverse knows where you want to go.');
    setStep((current) => Math.min(6, current + 1));
  };

  const parseCv = async () => {
    if (!cvFile && !cvText.trim()) return;
    setIsParsing(true);
    setError('');
    try {
      const form = new FormData();
      if (cvFile) form.append('file', cvFile);
      if (cvText.trim()) form.append('cvText', cvText.trim());
      const response = await fetch('/api/parse-cv', { method: 'POST', body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not read that CV.');
      const parsed = result.data || {};
      if (parsed.skills?.length) setSkillsText(Array.from(new Set([...skills, ...parsed.skills])).join(', '));
      if (parsed.yearsOfExperience) setYearsOfExperience(parsed.yearsOfExperience);
      if (parsed.careerLevel && careerLevels.includes(parsed.careerLevel)) setCareerLevel(parsed.careerLevel);
      if (!currentRole && parsed.workHistory?.[0]?.role) setCurrentRole(parsed.workHistory[0].role);
    } catch (parseError: any) {
      setError(parseError.message || 'Could not parse the CV. You can continue manually.');
    } finally {
      setIsParsing(false);
    }
  };

  const finish = async () => {
    if (!user) return setError('Your session is not ready. Please sign in again.');
    setIsSaving(true);
    setError('');
    try {
      await completeUserOnboarding(user.id, { fullName, citizenship, countryOfResidence, city, yearsOfExperience, careerLevel, skills, goals, selectedUniverses, remotePreference, relocationPreference, personaName: personaName.trim() || targetRole, personaRole: targetRole.trim() });
      router.replace('/app');
      router.refresh();
    } catch (saveError: any) {
      setError(saveError.message || 'We could not save your profile. Please try again.');
      setIsSaving(false);
    }
  };

  if (authLoading) return <div className="min-h-screen grid place-items-center"><Loader2 className="icon-md animate-spin text-zinc-400" /></div>;

  return <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[var(--background)]">
    <div className="w-full max-w-2xl space-y-5">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5"><img src="/brand/oppverse-icon-dark.png" alt="Oppverse AI" className="brand-icon w-8 h-8 object-contain rounded-lg" /><div><p className="font-display font-semibold text-base text-white">Build your opportunity universe</p><p className="text-[11px] text-zinc-500">One identity. Multiple opportunity personas.</p></div></div>
        <span className="text-xs font-semibold text-zinc-400">{step} of 6</span>
      </header>
      <div className="h-1 rounded-full bg-zinc-900 overflow-hidden"><div className="h-full bg-[var(--accent)] transition-all duration-200" style={{ width: `${(step / 6) * 100}%` }} /></div>

      <section className="p-5 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-6">
        {step === 1 && <Step title="About you" description="Start with the information Oppverse uses for eligibility." icon={UserRound}><div className="grid sm:grid-cols-2 gap-4"><Field label="Full name"><input className="onboarding-input" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" /></Field><Field label="Country of residence"><CountrySelect value={countryOfResidence} onChange={setCountryOfResidence} placeholder="Select your country" autoComplete="country-name" /></Field><Field label="City (optional)"><input className="onboarding-input" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" /></Field><Field label="Citizenship"><CountrySelect value={citizenship} onChange={setCitizenship} placeholder="Select your citizenship" /></Field></div></Step>}

        {step === 2 && <Step title="Professional direction" description="Choose your broad identity and the direction you want to pursue." icon={BriefcaseBusiness}><div className="grid sm:grid-cols-2 gap-2.5">{segments.map(([name, description]) => <Choice key={name} selected={segment === name} onClick={() => setSegment(name)} title={name} description={description} />)}</div><div className="grid sm:grid-cols-2 gap-4"><Field label="Current role (optional)"><input className="onboarding-input" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} placeholder="What do you do today?" /></Field><Field label="Target role or direction"><input className="onboarding-input" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="What are you moving toward?" /></Field><Field label="Career level"><select className="onboarding-input" value={careerLevel} onChange={(e) => setCareerLevel(e.target.value as UserProfile['careerLevel'])}>{careerLevels.map((level) => <option key={level}>{level}</option>)}</select></Field><Field label="Years of experience"><input type="number" min="0" max="50" className="onboarding-input" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(Number(e.target.value))} /></Field></div></Step>}

        {step === 3 && <Step title="Opportunity interests" description="Select every universe Oppverse should continuously monitor for you." icon={Compass}><div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">{universes.map((universe) => <button type="button" key={universe} onClick={() => toggleUniverse(universe)} className={`selection-tile ${selectedUniverses.includes(universe) ? 'selection-tile-active' : ''}`}><span>{universe}</span>{selectedUniverses.includes(universe) && <Check className="icon-xs" />}</button>)}</div></Step>}

        {step === 4 && <Step title="Goals and preferences" description="Tell Oppverse what progress should look like for this persona." icon={Target}><Field label="Your goals (one per line)"><textarea rows={4} className="onboarding-input resize-none" value={goalsText} onChange={(e) => setGoalsText(e.target.value)} placeholder={'Land a remote product role\nSecure a fully funded fellowship'} /></Field><div className="grid sm:grid-cols-2 gap-4"><Field label="Work/location preference"><select className="onboarding-input" value={remotePreference} onChange={(e) => setRemotePreference(e.target.value as UserProfile['remotePreference'])}><option>Any</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select></Field><label className="flex items-center gap-3 px-4 min-h-11 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-300 mt-6"><input type="checkbox" checked={relocationPreference} onChange={(e) => setRelocationPreference(e.target.checked)} /> Open to relocation</label></div></Step>}

        {step === 5 && <Step title="Skills and optional CV" description="Add skills manually, use a CV to accelerate setup, or do both." icon={FileText}><Field label="Skills (separate with commas)"><textarea rows={3} className="onboarding-input resize-none" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="Product strategy, Python, Research, Public speaking" /></Field><div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 p-4 space-y-3"><div className="flex items-center gap-2 text-xs font-semibold text-zinc-200"><Upload className="icon-sm" /> Optional CV</div><input type="file" accept=".pdf,.doc,.docx,.txt" className="block w-full text-xs text-zinc-400" onChange={(e) => setCvFile(e.target.files?.[0] || null)} /><textarea rows={3} className="onboarding-input resize-none" value={cvText} onChange={(e) => setCvText(e.target.value)} placeholder="Or paste CV/profile text here" /><button type="button" className="btn btn-secondary" disabled={isParsing || (!cvFile && !cvText.trim())} onClick={parseCv}>{isParsing ? <Loader2 className="icon-sm animate-spin" /> : <FileText className="icon-sm" />} Extract profile details</button></div></Step>}

        {step === 6 && <Step title="Confirm your primary persona" description="This is your first opportunity lens. You can create additional personas later." icon={Globe2}><div className="space-y-4"><Field label="Persona name"><input className="onboarding-input" value={personaName} onChange={(e) => setPersonaName(e.target.value)} /></Field><div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3 text-xs"><Summary label="Direction" value={targetRole} /><Summary label="Opportunity universes" value={selectedUniverses.join(', ')} /><Summary label="Goals" value={goals.join(' · ')} /><Summary label="Skills" value={skills.length ? skills.join(', ') : 'Add later from your profile'} /></div></div></Step>}

        {error && <p className="text-xs text-rose-400 border border-rose-500/30 bg-rose-950/30 rounded-lg px-3 py-2" role="alert">{error}</p>}
        <footer className="flex items-center justify-between gap-3 pt-1"><button type="button" onClick={() => { setError(''); setStep((current) => Math.max(1, current - 1)); }} disabled={step === 1 || isSaving} className="btn btn-secondary disabled:opacity-40"><ArrowLeft className="icon-sm" /> Back</button>{step < 6 ? <button type="button" onClick={next} className="btn btn-primary">Continue <ArrowRight className="icon-sm" /></button> : <button type="button" onClick={finish} disabled={isSaving} className="btn btn-primary min-w-40">{isSaving ? <><Loader2 className="icon-sm animate-spin" /> Building universe</> : <>Enter Oppverse <ArrowRight className="icon-sm" /></>}</button>}</footer>
      </section>
    </div>
  </div>;
}

function Step({ title, description, icon: Icon, children }: { title: string; description: string; icon: React.ElementType; children: React.ReactNode }) { return <div className="space-y-5"><div className="flex gap-3"><span className="grid place-items-center w-9 h-9 rounded-lg border border-zinc-800 bg-zinc-900"><Icon className="icon-sm text-zinc-300" /></span><div><h1 className="font-display text-lg font-semibold text-white">{title}</h1><p className="text-xs text-zinc-400 mt-0.5">{description}</p></div></div>{children}</div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="block text-xs font-medium text-zinc-300 mb-1.5">{label}</span>{children}</label>; }
function CountrySelect({ value, onChange, placeholder, autoComplete }: { value: string; onChange: (value: string) => void; placeholder: string; autoComplete?: string }) { return <select className="onboarding-input" value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete}><option value="" disabled>{placeholder}</option>{countries.map((country) => <option key={country} value={country}>{country}</option>)}</select>; }
function Choice({ selected, onClick, title, description }: { selected: boolean; onClick: () => void; title: string; description: string }) { return <button type="button" onClick={onClick} className={`selection-tile min-h-20 !items-start text-left ${selected ? 'selection-tile-active' : ''}`}><span><strong className="block text-xs text-white">{title}</strong><span className="block text-[11px] text-zinc-400 mt-1 leading-relaxed">{description}</span></span>{selected && <Check className="icon-xs flex-shrink-0" />}</button>; }
function Summary({ label, value }: { label: string; value: string }) { return <div className="grid sm:grid-cols-[140px_1fr] gap-1"><span className="text-zinc-500">{label}</span><span className="text-zinc-200">{value || 'Not provided'}</span></div>; }
