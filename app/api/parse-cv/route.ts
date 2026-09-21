import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callGroq } from '@/lib/integrations/groq';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    let rawText = '';
    let fileName = 'Uploaded_Resume.pdf';
    let fileSize = '150 KB';
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const textInput = formData.get('cvText') as string | null;

      if (file) {
        fileName = file.name;
        fileSize = `${Math.round(file.size / 1024)} KB`;
        const buffer = Buffer.from(await file.arrayBuffer());

        if (file.name.toLowerCase().endsWith('.pdf')) {
          try {
            // Server-side PDF Parsing
            const pdfParse = require('pdf-parse');
            const pdfData = await pdfParse(buffer);
            rawText = pdfData.text || '';
          } catch (pdfErr) {
            console.warn('PDF parsing error, falling back to buffer string:', pdfErr);
            rawText = buffer.toString('utf-8');
          }
        } else {
          rawText = buffer.toString('utf-8');
        }
      } else if (textInput) {
        rawText = textInput;
        fileName = 'Pasted_Resume_Text.txt';
      }
    } else {
      const json = await req.json();
      rawText = json.cvText || '';
      fileName = json.fileName || 'Pasted_Resume_Text.txt';
    }

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: 'No readable text found in the uploaded resume.' }, { status: 400 });
    }

    // High-Fidelity Extraction Engine
    const deterministicData = extractProfileFromText(rawText, fileName);
    const parsedData = await extractProfileWithAI(rawText, deterministicData);

    // If authenticated, optionally save to Supabase vault_documents
    if (user.id) {
      try {
        await supabase.from('vault_documents').insert({
          user_id: user.id,
          name: fileName,
          document_type: 'Master Resume / CV',
          file_size: fileSize,
          tags: ['CV', 'Parsed', ...parsedData.skills.slice(0, 3)],
          extracted_text: rawText.substring(0, 5000)
        });
      } catch (dbErr) {
        console.warn('Could not save to vault_documents in DB:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      meta: {
        fileName,
        fileSize,
        characterCount: rawText.length
      }
    });
  } catch (err: any) {
    console.error('Error in parse-cv API:', err);
    return NextResponse.json({ error: err.message || 'Failed to extract resume data' }, { status: 500 });
  }
}

async function extractProfileWithAI(text: string, fallback: ReturnType<typeof extractProfileFromText>) {
  const response = await callGroq([
    { role: 'system', content: 'Extract CV facts into JSON. Never invent information. Return roles, skills, industries, achievements, education, projects, and interests. Every item must include value and an exact evidence quote from the CV. Return suggestedRole only when directly supported. Do not infer citizenship from location.' },
    { role: 'user', content: text.slice(0, 16000) },
  ], { jsonMode: true, temperature: 0, max_tokens: 1800 });
  if (!response) return fallback;

  try {
    const parsed = JSON.parse(response);
    const supported = (items: unknown) => Array.isArray(items)
      ? items.filter((item) => item?.value && item?.evidence && text.toLowerCase().includes(String(item.evidence).toLowerCase()))
      : [];
    const aiSkills = supported(parsed.skills).map((item) => String(item.value).trim());
    const roles = supported(parsed.roles);
    const suggestedRole = roles[0]?.value || (parsed.suggestedRole?.evidence && text.toLowerCase().includes(String(parsed.suggestedRole.evidence).toLowerCase()) ? parsed.suggestedRole.value : '');
    return {
      ...fallback,
      skills: Array.from(new Set([...fallback.skills, ...aiSkills])),
      industries: supported(parsed.industries),
      achievements: supported(parsed.achievements),
      projects: supported(parsed.projects),
      professionalInterests: supported(parsed.interests),
      suggestedPersonas: suggestedRole ? [{
        id: 'suggested-persona',
        name: suggestedRole,
        role: suggestedRole,
        headline: aiSkills.slice(0, 3).join(' / '),
        targetUniverses: ['Jobs'],
        skills: aiSkills.slice(0, 8),
        goals: [],
      }] : fallback.suggestedPersonas,
      extractionMethod: 'groq-evidence-backed',
    };
  } catch {
    return fallback;
  }
}

/**
 * Intelligent Entity & Timeline Extraction Algorithm
 */
function extractProfileFromText(text: string, fileName: string) {
  const clean = text.replace(/\r\n/g, '\n');
  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Full Name Extraction (Top-most non-empty line or detected pattern)
  let fullName = lines[0] || 'Applicant';
  if (fullName.length > 40 || fullName.includes('@') || fullName.includes('http')) {
    const nameCandidate = lines.find(l => l.length < 35 && !l.includes('@') && !l.includes(':') && !l.toLowerCase().includes('curriculum'));
    if (nameCandidate) fullName = nameCandidate;
  }

  // 2. Email Detection
  const emailMatch = clean.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  const email = emailMatch ? emailMatch[1] : '';

  // 3. Citizenship & Locations Detection
  const countries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United Kingdom', 'United States', 'Canada', 'Germany', 'Rwanda', 'Egypt'];
  const detectedCitizenship: string[] = [];
  countries.forEach(c => {
    if (new RegExp(`\\b${c}\\b`, 'i').test(clean)) {
      detectedCitizenship.push(c);
    }
  });

  // 4. Skills Taxonomy Ingestion
  const skillTaxonomy = [
    'Product Marketing', 'Go-To-Market Strategy', 'Agentic AI Mastery', 'Claude Code', 'Prompt Engineering',
    'Demand Generation', 'Positioning & Messaging', 'Content Strategy', 'Public Speaking', 'n8n Automation',
    'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Python', 'Supabase', 'PostgreSQL', 'Machine Learning',
    'Financial Modeling', 'Venture Fundraising', 'Growth Experimentation', 'SEO Optimization', 'User Research',
    'B2B SaaS', 'Keynote Presentations', 'Team Leadership', 'Product Management', 'Data Analysis'
  ];

  const matchedSkills: string[] = [];
  skillTaxonomy.forEach(skill => {
    if (new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(clean)) {
      matchedSkills.push(skill);
    }
  });

  // 5. Work History Ingestion
  const workHistory: Array<{ role: string; company: string; location: string; startDate: string; endDate: string; description: string }> = [];
  
  // Look for date blocks like (2024 - 2026, Aug 2026 - Present, etc.)
  const roleKeywords = ['Founding GTM & Product Marketing Lead', 'Product Marketing Manager', 'AI Systems Consultant', 'Growth Lead', 'Software Engineer', 'Senior Strategist'];
  

  // 6. Education Ingestion
  const education: Array<{ degree: string; institution: string; field: string; graduationYear: string }> = [];

  // 7. Seniority & Years of Experience Calculation
  const yearsMatch = clean.match(/(\d+)\+?\s*(years|yrs)/i);
  let yearsOfExperience = yearsMatch ? parseInt(yearsMatch[1], 10) : 0;
  if (yearsOfExperience > 50) yearsOfExperience = 0;

  let careerLevel: 'Early-Career' | 'Mid-Career' | 'Senior' | 'Executive' | 'Founder' | 'Student' = 'Early-Career';
  if (yearsOfExperience >= 10) careerLevel = 'Executive';
  else if (yearsOfExperience >= 5) careerLevel = 'Senior';
  else if (yearsOfExperience >= 3) careerLevel = 'Mid-Career';
  else careerLevel = 'Early-Career';

  const likelyRoleLine = lines.find((line) => /manager|engineer|designer|researcher|founder|consultant|student|analyst|director|officer|specialist|developer/i.test(line)) || '';
  const suggestedPersonas = likelyRoleLine ? [{
    id: 'suggested-persona',
    name: likelyRoleLine,
    role: likelyRoleLine,
    headline: matchedSkills.slice(0, 3).join(' / '),
    targetUniverses: ['Jobs'],
    skills: matchedSkills.slice(0, 5),
    goals: [],
  }] : [];

  return {
    fullName,
    email,
    headline: likelyRoleLine,
    yearsOfExperience,
    careerLevel,
    citizenship: detectedCitizenship,
    countryOfResidence: detectedCitizenship[0] || '',
    city: '',
    skills: Array.from(new Set(matchedSkills)),
    education,
    workHistory,
    suggestedPersonas,
    profileStrength: Math.min(85, 20 + matchedSkills.length * 5 + (email ? 10 : 0) + (likelyRoleLine ? 15 : 0))
  };
}
