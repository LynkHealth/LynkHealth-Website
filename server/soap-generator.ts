/**
 * SOAP Note Generator
 *
 * Uses Claude API to extract structured SOAP notes from clinical transcripts.
 * Requires ANTHROPIC_API_KEY environment variable.
 *
 * IMPORTANT: AI-generated SOAP notes MUST be reviewed and signed by a clinician
 * before being considered part of the medical record.
 */

export interface SoapNoteResult {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  aiModel: string;
  aiConfidence: string;
}

const SOAP_SYSTEM_PROMPT = `You are a medical documentation assistant. Your job is to extract a structured SOAP note from a clinical encounter transcript.

IMPORTANT RULES:
- Only include information explicitly stated in the transcript
- Never fabricate, infer, or assume clinical details not present in the conversation
- If a SOAP section has no relevant information in the transcript, write "No information documented in this encounter."
- Use standard medical terminology and abbreviations where appropriate
- Be concise but thorough
- This note will be reviewed and signed by a clinician — flag any areas of uncertainty

Format each section clearly:

SUBJECTIVE: Patient's reported symptoms, complaints, history, and concerns as expressed during the encounter.

OBJECTIVE: Observable findings, vitals, examination results, or clinical data discussed during the encounter.

ASSESSMENT: Clinical impressions, diagnoses, or problems identified during the encounter.

PLAN: Treatment plan, medications, referrals, follow-up instructions, or next steps discussed.`;

/**
 * Generate a SOAP note from a transcript using Claude API.
 */
export async function generateSoapNote(
  transcript: string,
  programType?: string,
): Promise<SoapNoteResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is required for SOAP note generation");
  }

  const userPrompt = `Here is the transcript of a clinical encounter${programType ? ` (${programType} program)` : ""}. Please generate a SOAP note from this transcript.

TRANSCRIPT:
${transcript}

Please respond in exactly this JSON format:
{
  "subjective": "...",
  "objective": "...",
  "assessment": "...",
  "plan": "..."
}`;

  const model = "claude-sonnet-4-5-20250929";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: SOAP_SYSTEM_PROMPT,
      messages: [
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as any;
  const textBlock = data.content?.find((b: any) => b.type === "text");
  if (!textBlock?.text) {
    throw new Error("No text response from Claude API");
  }

  // Parse JSON from response (handle markdown code blocks)
  let jsonStr = textBlock.text.trim();
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  let parsed: { subjective: string; objective: string; assessment: string; plan: string };
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    // Fallback: try to extract sections manually
    parsed = extractSectionsFromText(textBlock.text);
  }

  return {
    subjective: parsed.subjective || "No information documented in this encounter.",
    objective: parsed.objective || "No information documented in this encounter.",
    assessment: parsed.assessment || "No information documented in this encounter.",
    plan: parsed.plan || "No information documented in this encounter.",
    aiModel: model,
    aiConfidence: data.stop_reason === "end_turn" ? "high" : "medium",
  };
}

/**
 * Fallback parser: extract SOAP sections from free-text response.
 */
function extractSectionsFromText(text: string): {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
} {
  const sections = {
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  };

  const patterns: [keyof typeof sections, RegExp][] = [
    ["subjective", new RegExp("(?:SUBJECTIVE|Subjective)[:\\s]*([\\s\\S]+?)(?=(?:OBJECTIVE|Objective|ASSESSMENT|Assessment|PLAN|Plan)|$)")],
    ["objective", new RegExp("(?:OBJECTIVE|Objective)[:\\s]*([\\s\\S]+?)(?=(?:ASSESSMENT|Assessment|PLAN|Plan)|$)")],
    ["assessment", new RegExp("(?:ASSESSMENT|Assessment)[:\\s]*([\\s\\S]+?)(?=(?:PLAN|Plan)|$)")],
    ["plan", new RegExp("(?:PLAN|Plan)[:\\s]*([\\s\\S]+?)$")],
  ];

  for (const [key, regex] of patterns) {
    const match = text.match(regex);
    if (match?.[1]) {
      sections[key] = match[1].trim();
    }
  }

  return sections;
}

/**
 * Create a blank SOAP note for manual entry.
 */
export function createBlankSoapNote(): SoapNoteResult {
  return {
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    aiModel: "manual",
    aiConfidence: "n/a",
  };
}

/**
 * Check if AI SOAP note generation is available.
 */
export function isSoapGenerationConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
