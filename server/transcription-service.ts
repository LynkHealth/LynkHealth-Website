/**
 * Transcription Service
 *
 * Converts audio recordings to text using configurable ASR providers.
 * Designed for HIPAA compliance — all providers must have BAAs.
 *
 * Supported providers:
 *   - deepgram (recommended, requires DEEPGRAM_API_KEY)
 *   - manual  (paste-in transcription, no external API)
 *
 * Audio is processed server-side; raw audio is never stored permanently.
 */

export interface TranscriptionSegment {
  start: number;     // seconds
  end: number;       // seconds
  speaker?: string;  // speaker label
  text: string;
}

export interface TranscriptionResult {
  content: string;                    // full transcript text
  segments: TranscriptionSegment[];   // timestamped segments
  provider: string;
  languageCode: string;
  confidenceScore: number;            // 0-1
}

/**
 * Transcribe audio using Deepgram Nova-2 Medical.
 * Requires DEEPGRAM_API_KEY environment variable.
 */
async function transcribeWithDeepgram(audioBuffer: Buffer, mimeType: string): Promise<TranscriptionResult> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY is required for transcription");
  }

  const response = await fetch("https://api.deepgram.com/v1/listen?model=nova-2-medical&smart_format=true&diarize=true&punctuate=true&language=en-US", {
    method: "POST",
    headers: {
      "Authorization": `Token ${apiKey}`,
      "Content-Type": mimeType,
    },
    body: audioBuffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Deepgram API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as any;
  const channel = data.results?.channels?.[0];
  const alternative = channel?.alternatives?.[0];

  if (!alternative) {
    throw new Error("No transcription result returned from Deepgram");
  }

  const segments: TranscriptionSegment[] = [];
  if (alternative.paragraphs?.paragraphs) {
    for (const paragraph of alternative.paragraphs.paragraphs) {
      for (const sentence of paragraph.sentences || []) {
        segments.push({
          start: sentence.start || 0,
          end: sentence.end || 0,
          speaker: `Speaker ${paragraph.speaker !== undefined ? paragraph.speaker + 1 : "?"}`,
          text: sentence.text || "",
        });
      }
    }
  } else if (alternative.words) {
    // Fallback: group words into segments by speaker
    let currentSegment: TranscriptionSegment | null = null;
    for (const word of alternative.words) {
      const speaker = `Speaker ${(word.speaker ?? 0) + 1}`;
      if (!currentSegment || currentSegment.speaker !== speaker) {
        if (currentSegment) segments.push(currentSegment);
        currentSegment = {
          start: word.start,
          end: word.end,
          speaker,
          text: word.punctuated_word || word.word,
        };
      } else {
        currentSegment.end = word.end;
        currentSegment.text += " " + (word.punctuated_word || word.word);
      }
    }
    if (currentSegment) segments.push(currentSegment);
  }

  return {
    content: alternative.transcript || "",
    segments,
    provider: "deepgram",
    languageCode: "en-US",
    confidenceScore: alternative.confidence ?? 0,
  };
}

/**
 * Create a manual transcription result from user-provided text.
 */
function createManualTranscription(text: string): TranscriptionResult {
  return {
    content: text,
    segments: [{
      start: 0,
      end: 0,
      speaker: "Manual Entry",
      text,
    }],
    provider: "manual",
    languageCode: "en-US",
    confidenceScore: 1.0,
  };
}

/**
 * Main transcription entry point.
 * Routes to the configured provider.
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType: string = "audio/webm",
): Promise<TranscriptionResult> {
  // Use Deepgram if configured, otherwise throw
  if (process.env.DEEPGRAM_API_KEY) {
    return transcribeWithDeepgram(audioBuffer, mimeType);
  }

  throw new Error(
    "No transcription provider configured. Set DEEPGRAM_API_KEY to enable automatic transcription, or use manual transcription."
  );
}

/**
 * Create a transcription from manually entered text.
 */
export function transcribeManual(text: string): TranscriptionResult {
  return createManualTranscription(text);
}

/**
 * Check if automatic transcription is available.
 */
export function isTranscriptionConfigured(): boolean {
  return !!process.env.DEEPGRAM_API_KEY;
}
