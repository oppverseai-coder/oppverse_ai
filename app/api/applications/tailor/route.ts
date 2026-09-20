import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UserProfile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { 
      opportunityTitle, 
      provider, 
      category, 
      documentType, 
      profile, 
      userId 
    } = await req.json();

    const applicantName = profile?.fullName || 'Tomide Williams';
    const experienceYears = profile?.yearsOfExperience || 6;
    const skillsList = (profile?.skills || ['Product Marketing', 'AI Systems', 'GTM Strategy', 'Claude Code']).slice(0, 5).join(', ');

    let generatedContent = '';
    let docTitle = '';

    if (documentType === 'motivation_statement') {
      docTitle = `Tailored Motivation Statement - ${opportunityTitle}`;
      generatedContent = `STATEMENT OF PURPOSE & INTENT\n` +
        `Candidate: ${applicantName}\n` +
        `Application For: ${opportunityTitle} (${provider})\n\n` +
        `Dear Selection Committee,\n\n` +
        `I am writing to formally submit my application for the ${opportunityTitle} with ${provider}. With over ${experienceYears} years of demonstrable leadership spanning Product Marketing, Go-To-Market strategy, and Agentic AI workflow systems in high-growth ecosystems, I bring a unique dual perspective of strategic product positioning and practical AI execution.\n\n` +
        `My career has centered on architecting scalable commercial engines and empowering global teams with intelligent AI infrastructure. At Conductor (Vera Pax Technologies) and through extensive AI coaching initiatives, I have spearheaded the transformation of complex technological capabilities into high-conversion business systems, grounded in verifiable market metrics.\n\n` +
        `This program directly aligns with my mission to bridge emerging market innovation with global opportunity networks. I look forward to contributing my expertise in ${skillsList} while actively engaging with the fellow cohort to drive measurable global impact.\n\n` +
        `Sincerely,\n` +
        `${applicantName}`;
    } else if (documentType === 'cv_bullets') {
      docTitle = `Tailored Impact Bullets - ${opportunityTitle}`;
      generatedContent = `TARGETED CV IMPACT BULLETS (Tailored for ${opportunityTitle})\n\n` +
        `â€¢ Architected full-funnel GTM commercial engine and Time Intelligence positioning, driving rapid qualified pipeline acceleration.\n` +
        `â€¢ Designed and deployed autonomous Agentic AI workflows using Claude Code and n8n, cutting operational cycle times by 65%.\n` +
        `â€¢ Spearheaded high-impact educational and product launches reaching 400+ participants with 98% satisfaction benchmarks.\n` +
        `â€¢ Championed cross-functional alignment between engineering, product, and executive stakeholders to ship production-grade systems.\n` +
        `â€¢ Verified core capabilities: ${skillsList}.`;
    } else {
      docTitle = `Session Abstract & Speaker Kit - ${opportunityTitle}`;
      generatedContent = `SPEAKER PROPOSAL & KEYNOTE ABSTRACT\n` +
        `Speaker: ${applicantName}\n` +
        `Event: ${opportunityTitle} (${provider})\n\n` +
        `Title: Building Agentic GTM Systems & Time Intelligence in 2026\n\n` +
        `Abstract (300 Words):\n` +
        `As artificial intelligence transitions from conversational prompts to autonomous agents, organizations face a critical bottleneck: translating AI capability into measurable business revenue. In this session, ${applicantName} breaks down the architecture of production-grade Agentic GTM systems, demonstrating how to eliminate discovery friction, qualify opportunities in real-time, and scale commercial engines with zero hallucination.\n\n` +
        `Key Takeaways:\n` +
        `1. The 5-layer framework for autonomous opportunity intelligence.\n` +
        `2. Live case studies from emerging market AI product launches.\n` +
        `3. Practical workflows using modern agentic toolchains.`;
    }

    // Optionally auto-save drafted document to Supabase vault_documents
    if (userId) {
      try {
        const supabase = createClient();
        await supabase.from('vault_documents').insert({
          user_id: userId,
          name: `${docTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`,
          document_type: documentType === 'motivation_statement' ? 'Motivation Statement' : 'Master Resume / CV',
          file_size: `${Math.round(generatedContent.length / 1024) || 1} KB`,
          tags: ['AI Tailored', category || 'General', 'Draft'],
          extracted_text: generatedContent
        });
      } catch (dbErr) {
        console.warn('Could not auto-save tailored doc to vault:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      title: docTitle,
      content: generatedContent
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Tailoring generation failed' }, { status: 500 });
  }
}
