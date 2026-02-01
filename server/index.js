import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('\n⚠️  WARNING: GEMINI_API_KEY not set!');
  console.warn('   Get your FREE key from: https://aistudio.google.com/apikey');
  console.warn('   Then create a .env file with: GEMINI_API_KEY=your_key\n');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const SYSTEM_PROMPT = `You are an AI facial aesthetics analyzer. Analyze the provided face photo and return ONLY valid JSON (no markdown, no code blocks).

Rate features out of 10. Most people score 5-8. Be realistic but constructive.

IMPORTANT: Analyze the ACTUAL photo provided. Each person's face is unique - give personalized ratings based on what you see, not generic responses.

Return this exact JSON structure:
{
  "photoQuality": { "score": 0-100, "issues": [] },
  "overall": {
    "rating10": 0-10,
    "confidence": "low|medium|high",
    "summary": "2-3 sentence personalized summary describing THIS specific person's features"
  },
  "features": [
    {
      "key": "skin",
      "label": "Skin Quality", 
      "rating10": 0-10,
      "confidence": "high",
      "strengths": ["specific strength you observe"],
      "imperfections": ["specific area for improvement you observe"],
      "why": ["explanation based on what you see"],
      "fixes": [{"title": "Fix name", "type": "no_cost", "difficulty": "easy", "timeToSeeChange": "2-4 weeks", "steps": ["step1", "step2"]}]
    }
  ],
  "harmony": { "rating10": 0-10, "confidence": "medium", "notes": ["specific observation about facial proportions"] },
  "symmetry": { "rating10": 0-10, "confidence": "medium", "notes": ["specific observation"], "asymmetries": [] },
  "hair": { "rating10": 0-10, "confidence": "high", "notes": ["specific observation about their hair"], "suggestions": ["personalized suggestion"] },
  "topFixes": [
    { "title": "Fix name", "why": "personalized reason based on their features", "impact": "high", "steps": ["step1", "step2"] }
  ],
  "safety": { "disclaimer": "Results are estimates based on general aesthetic guidelines. Beauty is subjective.", "tone": "neutral" },
  "tier": { "isPremium": false, "depth": "free" }
}

Analyze these features for the features array: skin, eye_area, nose, lips, cheekbones, jawline.
Each feature needs: key, label, rating10, confidence, strengths, imperfections, why, fixes.

CRITICAL RULES:
- Actually look at the photo and describe what YOU SEE
- Give DIFFERENT ratings for different features based on the actual face
- Be specific - mention actual observations like "prominent cheekbones", "slight dark circles", "well-defined jawline", etc.
- Ratings should vary - not all 7s, give a realistic spread (some 6s, some 8s, etc.)
- Be constructive and kind - frame imperfections as "areas for improvement"
- Never insult or be harsh`;

app.post('/api/face/analyze', async (req, res) => {
  try {
    if (!GEMINI_API_KEY || !genAI) {
      return res.status(503).json({ 
        error: 'API key not configured',
        message: 'GEMINI_API_KEY not set. Get your FREE key from https://aistudio.google.com/apikey'
      });
    }

    const { frontImage, sideImage, gender, premiumEnabled } = req.body;

    if (!frontImage) {
      return res.status(400).json({ error: 'Front image is required' });
    }

    console.log(`Analyzing face - Gender: ${gender}, Side photo: ${!!sideImage}`);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const imageParts = [
      {
        inlineData: {
          data: frontImage,
          mimeType: 'image/jpeg',
        },
      },
    ];

    if (sideImage) {
      imageParts.push({
        inlineData: {
          data: sideImage,
          mimeType: 'image/jpeg',
        },
      });
    }

    const prompt = `${SYSTEM_PROMPT}

Gender of person: ${gender}
Side photo provided: ${sideImage ? 'Yes' : 'No'}

Now analyze the face in this photo. Look carefully at their specific features and provide personalized ratings and observations. Return ONLY the JSON object, no other text.`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();

    // Clean up response - remove any markdown formatting
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', text.substring(0, 500));
      throw new Error('Failed to parse AI response');
    }

    // Ensure tier info is correct
    parsedResponse.tier = { 
      isPremium: premiumEnabled, 
      depth: premiumEnabled ? 'premium' : 'free' 
    };

    // Add side_missing to issues if no side photo
    if (!sideImage && parsedResponse.photoQuality) {
      if (!parsedResponse.photoQuality.issues) {
        parsedResponse.photoQuality.issues = [];
      }
      if (!parsedResponse.photoQuality.issues.includes('side_missing')) {
        parsedResponse.photoQuality.issues.push('side_missing');
      }
    }

    console.log('Analysis complete - Overall rating:', parsedResponse.overall?.rating10);
    res.json(parsedResponse);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n✨ Face Analyzer server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Analysis endpoint: POST http://localhost:${PORT}/api/face/analyze\n`);
});
