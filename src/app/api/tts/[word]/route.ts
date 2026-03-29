import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const { AZURE_SPEECH_KEY } = process.env;
const { AZURE_SPEECH_REGION } = process.env;

function synthesize(word: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
      reject(new Error('Azure Speech credentials not configured'));
      return;
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_SPEECH_REGION);
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
    speechConfig.speechSynthesisVoiceName = 'en-GB-BellaNeural';

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      word,
      result => {
        synthesizer.close();

        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve(result.audioData);
        } else {
          reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
        }
      },
      error => {
        synthesizer.close();
        reject(error);
      },
    );
  });
}

const WORD_PATTERN = /^[a-z]+$/;

export async function GET(_request: Request, { params }: { params: Promise<{ word: string }> }) {
  const { word } = await params;
  const normalised = word.toLowerCase();

  if (!WORD_PATTERN.test(normalised)) {
    return new Response('Invalid word', { status: 400 });
  }

  try {
    const audioData = await synthesize(normalised);

    return new Response(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('TTS synthesis error:', error);
    return new Response('Speech synthesis failed', { status: 500 });
  }
}
