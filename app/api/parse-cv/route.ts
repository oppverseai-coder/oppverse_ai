import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { cvText, fileName } = await req.json();

    if (!cvText || cvText.trim().length === 0) {
      return NextResponse.json({ error: "CV text is required" }, { status: 400 });
    }

    // High-fidelity profile extraction simulation (can connect to OpenAI / Anthropic / Gemini in backend)
    const extractedData = {
      fullName: "Tomide Williams",
      headline: "Founding GTM Lead & AI Revenue Systems Engineer",
      yearsOfExperience: 6,
      careerLevel: "Senior",
      citizenship: ["Nigeria"],
      countryOfResidence: "Nigeria",
      city: "Lagos",
      skills: [
        "Product Marketing",
        "Go-To-Market Strategy",
        "Agentic AI Mastery",
        "Demand Generation",
        "Claude Code & LLM Prompting",
        "n8n Workflow Automation",
        "Positioning & Messaging",
        "Public Speaking"
      ],
      education: [
        {
          degree: "B.Sc. in Computer Science / Information Systems",
          institution: "University of Lagos",
          field: "Technology & Software Systems",
          graduationYear: "2019"
        }
      ],
      workHistory: [
        {
          role: "Founding GTM & Product Marketing Lead",
          company: "Conductor (Vera Pax Technologies)",
          location: "Remote",
          startDate: "Aug 2026",
          endDate: "Present",
          description: "Leading commercial engine, positioning around Time Intelligence, and demand generation."
        },
        {
          role: "Product Marketing Manager",
          company: "Koppoh",
          location: "Lagos, Nigeria",
          startDate: "2024",
          endDate: "2026",
          description: "Directed flagship photography course launch (BOP) and creator monetization systems."
        }
      ],
      suggestedPersonas: [
        {
          name: "Product Marketing Leader",
          role: "Senior Product Marketing Manager / GTM Lead",
          targetUniverses: ["Jobs", "Fellowships", "Conferences"]
        },
        {
          name: "AI Consultant & Systems Engineer",
          role: "AI Workflow Architect",
          targetUniverses: ["Grants", "Accelerators", "Fellowships"]
        }
      ],
      extractedFrom: fileName || "Pasted CV"
    };

    return NextResponse.json({ success: true, data: extractedData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to parse CV" }, { status: 500 });
  }
}
