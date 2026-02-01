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

// THE HONESTY PATCH - enforces realistic, calibrated scoring
const SYSTEM_PROMPT = `You are a facial aesthetics analyzer. You must be HONEST and SPECIFIC without being harsh.
Output STRICT JSON ONLY. No markdown. No extra text. No code blocks.

===== CRITICAL SCORING RULES =====

1. USE REALISTIC DISTRIBUTION:
   - Average should be ~5.5/10
   - Most people (70%) should score 4.5-6.5
   - A 7.0 is ABOVE AVERAGE (top 30%) - not default
   - 8.0+ is RARE (top 15%)
   - 9.0+ is EXCEPTIONAL (top 5%)
   - NEVER give 7.0 to everything - that's score inflation

2. REQUIRE VARIANCE:
   - Different features should have DIFFERENT scores
   - Everyone has strengths (some 6-7s) and weaknesses (some 4-5s)
   - If all scores are within 0.5 of each other, you're doing it wrong
   - Example good distribution: skin 5.2, eyes 6.4, jaw 4.8, nose 5.9

3. PROVIDE EVIDENCE:
   - Every rating needs visible evidence/cues
   - "Good jawline" is NOT evidence
   - "Visible mandibular angle creating shadow, decent definition" IS evidence
   - If you can't see evidence, lower confidence

4. COMPUTE POTENTIAL (this is key):
   - currentScore10: how they look NOW in these photos
   - potentialScore10: realistic after HIGH-ROI improvements
   - Calculate: potentialScore = currentScore + sum(improvement_deltas)
   - Realistic deltas:
     * Hair fix: +0.2 to +0.8
     * Skin improvement: +0.2 to +1.0
     * Under-eye treatment: +0.1 to +0.6
     * Brow grooming: +0.1 to +0.5
     * Body composition (face): +0.2 to +0.8
     * Posture correction: +0.1 to +0.4
   - Cap potential at 10.0
   - ALWAYS identify top 3 levers with specific deltas

5. CONFIDENCE & LIMITATIONS:
   - If side photo missing: chin/nose projection = LOW confidence
   - If selfie angle: symmetry = LOW confidence (state this!)
   - If lighting uneven: cheekbone/jaw = MEDIUM confidence
   - Be transparent about what you can't assess

===== TONE RULES =====
- Neutral and constructive
- NO insults, NO "kind face" cope
- Frame weaknesses as "holding back" not "flaws"
- State facts without sugar-coating

===== REQUIRED JSON STRUCTURE =====
{
  "photoQuality": {
    "score": 0-100,
    "issues": ["side_missing", "angle_distortion", etc],
    "assessmentLimitations": ["specific limitation 1", "specific limitation 2"]
  },
  "overall": {
    "currentScore10": HONEST_NUMBER (most people 4.5-6.5),
    "potentialScore10": currentScore + deltas (realistic),
    "ceilingScore10": null or number (premium only, theoretical max with procedures),
    "confidence": "low|medium|high",
    "summary": "2-3 sentence SPECIFIC summary about THIS person's face",
    "calibrationNote": "explain what the scores mean in context"
  },
  "potential": {
    "totalPossibleGain": sum of all deltas,
    "deltas": [
      {
        "lever": "skin|hair|under_eye|brows|body_fat|posture",
        "currentIssue": "what's holding them back (specific)",
        "delta": realistic number (0.1-1.0),
        "potentialGain": "what improves",
        "timeline": "2 weeks|4 weeks|8 weeks|12 weeks",
        "difficulty": "easy|moderate|difficult",
        "steps": ["step1", "step2", "step3"]
      }
    ],
    "top3Levers": [
      { "lever": "name", "delta": number, "timeline": "X weeks", "priority": 1 },
      { "lever": "name", "delta": number, "timeline": "X weeks", "priority": 2 },
      { "lever": "name", "delta": number, "timeline": "X weeks", "priority": 3 }
    ],
    "timelineToFullPotential": "X-Y weeks with consistent effort"
  },
  "features": [
    {
      "key": "skin|eye_area|eyebrows|nose|lips|cheekbones|jawline|chin|neck_posture",
      "label": "Display Name",
      "rating10": HONEST number with variance,
      "confidence": "low|medium|high",
      "evidence": "WHY this rating - specific visible cues",
      "photoLimitations": ["limitation if any"],
      "strengths": ["specific strength 1", "specific strength 2"],
      "holdingBack": ["what's reducing the score"],
      "whyItMatters": "brief note on impact",
      "subFeatures": [
        {"name": "sub", "rating10": number, "note": "observation", "isStrength": bool, "evidence": "why"}
      ],
      "fixes": {
        "quickWins": [{"title": "", "type": "no_cost|low_cost", "difficulty": "easy", "timeline": "immediate|2 weeks", "expectedImpact": "", "steps": []}],
        "shortTerm": [{"title": "", "type": "no_cost|low_cost", "difficulty": "easy|moderate", "timeline": "2-4 weeks", "expectedImpact": "", "steps": []}],
        "mediumTerm": [{"title": "", "type": "no_cost|low_cost", "difficulty": "moderate|difficult", "timeline": "8-12 weeks", "expectedImpact": "", "steps": []}],
        "proOptions": [{"title": "", "type": "procedural", "difficulty": "easy", "timeline": "", "expectedImpact": "", "steps": []}]
      }
    }
  ],
  "harmony": {
    "rating10": number,
    "confidence": "medium",
    "evidence": "why this harmony score",
    "notes": ["specific observation 1", "specific observation 2"],
    "facialThirds": {
      "upper": {"assessment": "", "balance": ""},
      "middle": {"assessment": "", "balance": ""},
      "lower": {"assessment": "", "balance": ""},
      "overallBalance": ""
    }
  },
  "symmetry": {
    "rating10": number,
    "confidence": "low" (selfies distort this!),
    "photoLimitation": "Selfie angle creates 10-15% distortion",
    "evidence": "what you can observe",
    "notes": [],
    "asymmetries": [{"area": "", "description": "", "severity": "minimal|common|noticeable"}]
  },
  "hair": {
    "rating10": number,
    "confidence": "high",
    "evidence": "why this hair score",
    "notes": [],
    "suggestions": []
  },
  "safety": {
    "disclaimer": "Scores reflect aesthetic guidelines, not personal worth. Beauty is subjective.",
    "tone": "neutral",
    "scoringContext": "We use honest calibration: 5.5 is average, most people score 4.5-6.5. A 7+ is notably above average."
  },
  "tier": {
    "isPremium": boolean,
    "depth": "free|premium"
  }
}

===== TIER DIFFERENCES =====
FREE tier:
- 6 core features: skin, eye_area, nose, lips, cheekbones, jawline
- 1-2 notes per feature
- No subFeatures array
- 3-5 total fixes
- No proOptions
- No ceilingScore10

PREMIUM tier:
- All features including: eyebrows, chin, neck_posture, detailed symmetry
- Full subFeatures arrays (3-5 per category)
- 10+ detailed fixes with timelines
- proOptions with procedural treatments (info only)
- ceilingScore10 with disclaimer
- Facial thirds analysis
- Full asymmetry breakdown`;

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

    const tier = premiumEnabled ? 'premium' : 'free';
    console.log(`Analyzing face - Gender: ${gender}, Tier: ${tier}, Side photo: ${!!sideImage}`);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const imageParts = [
      {
        inlineData: {
          data: frontImage,
          mimeType: 'image/jpeg',
        },
      },
    ];

    // FACE DETECTION CHECK - Verify image contains a human face before analyzing
    console.log('Checking for face in image...');
    const faceCheckPrompt = `Look at this image and determine if it contains a clear human face that can be analyzed.

Respond with ONLY a JSON object in this exact format:
{
  "hasFace": true or false,
  "reason": "brief explanation"
}

Rules:
- hasFace = true ONLY if there is a clear, visible human face (front-facing preferred)
- hasFace = false if: no face, animal, object, cartoon/drawing, very blurry, face completely obscured
- Be strict - we need a real human face to analyze`;

    const faceCheckResult = await model.generateContent([faceCheckPrompt, imageParts[0]]);
    const faceCheckResponse = await faceCheckResult.response;
    let faceCheckText = faceCheckResponse.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const faceCheck = JSON.parse(faceCheckText);
      
      if (!faceCheck.hasFace) {
        console.log('No face detected:', faceCheck.reason);
        return res.status(400).json({
          error: 'No face detected',
          message: `This doesn't appear to be a face. ${faceCheck.reason || 'Please upload a clear photo of a human face.'}`,
          suggestion: 'Please upload a clear, front-facing photo of a human face for analysis.'
        });
      }
      console.log('Face detected, proceeding with analysis...');
    } catch (parseError) {
      // If we can't parse the face check, continue anyway (fail open)
      console.log('Face check parse failed, proceeding with analysis...');
    }

    if (sideImage) {
      imageParts.push({
        inlineData: {
          data: sideImage,
          mimeType: 'image/jpeg',
        },
      });
    }

    const userPrompt = `${SYSTEM_PROMPT}

===== CURRENT ANALYSIS REQUEST =====
Gender: ${gender}
Tier: ${tier}
Side photo: ${sideImage ? 'YES - can assess chin projection' : 'NO - mark chin/nose projection as LOW confidence'}

${tier === 'free' ? `
FREE TIER - Analyze these features only:
- skin, eye_area, nose, lips, cheekbones, jawline
- Plus harmony, symmetry, hair
- 1-2 notes per feature, no subFeatures
- 3-5 total improvement deltas
- No proOptions
` : `
PREMIUM TIER - Full analysis:
- All features: skin, eye_area, eyebrows, nose, lips, cheekbones, jawline, chin, neck_posture
- Full subFeatures breakdown (3-5 per category)
- 8-12 improvement deltas with detailed steps
- Include proOptions (procedural treatments)
- Include ceilingScore10
- Facial thirds analysis
- Full asymmetry details
`}

REMEMBER:
1. Be HONEST - most people score 4.5-6.5 overall
2. Create VARIANCE - different features get different scores
3. Provide EVIDENCE - cite specific visible cues
4. Calculate POTENTIAL - show realistic improvement path with deltas
5. Top 3 levers are the most important output - make them actionable

Now analyze the photo and return ONLY the JSON object.`;

    const result = await model.generateContent([userPrompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();

    // Clean up response
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', text.substring(0, 500));
      throw new Error('Failed to parse AI response');
    }

    // POST-PROCESSING: Apply calibration curve to prevent score inflation
    parsedResponse = applyCalibration(parsedResponse);

    // Ensure tier info is correct
    parsedResponse.tier = {
      isPremium: premiumEnabled,
      depth: tier
    };

    // Add side_missing if no side photo
    if (!sideImage && parsedResponse.photoQuality) {
      if (!parsedResponse.photoQuality.issues) {
        parsedResponse.photoQuality.issues = [];
      }
      if (!parsedResponse.photoQuality.issues.includes('side_missing')) {
        parsedResponse.photoQuality.issues.push('side_missing');
      }
      if (!parsedResponse.photoQuality.assessmentLimitations) {
        parsedResponse.photoQuality.assessmentLimitations = [];
      }
      parsedResponse.photoQuality.assessmentLimitations.push(
        'Chin projection cannot be accurately assessed without side profile'
      );
    }

    console.log('Analysis complete - Current:', parsedResponse.overall?.currentScore10?.toFixed(1), 
                'Potential:', parsedResponse.overall?.potentialScore10?.toFixed(1));
    res.json(parsedResponse);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

// Calibration function to prevent score inflation
function applyCalibration(response) {
  // If the AI gave inflated scores (mean > 6.5), compress them
  const features = response.features || [];
  const scores = features.map(f => f.rating10).filter(s => typeof s === 'number');
  
  if (scores.length > 0) {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // If mean is too high (above 6.5), apply compression
    if (mean > 6.5) {
      const compressionFactor = 6.0 / mean; // Target mean of ~6.0
      
      features.forEach(feature => {
        if (typeof feature.rating10 === 'number') {
          // Compress toward 5.5 (true average)
          const delta = feature.rating10 - 5.5;
          feature.rating10 = Math.round((5.5 + delta * compressionFactor) * 10) / 10;
          feature.rating10 = Math.max(1, Math.min(9.5, feature.rating10)); // Cap at 9.5
        }
        
        // Also compress subFeatures if they exist
        if (feature.subFeatures) {
          feature.subFeatures.forEach(sf => {
            if (typeof sf.rating10 === 'number') {
              const delta = sf.rating10 - 5.5;
              sf.rating10 = Math.round((5.5 + delta * compressionFactor) * 10) / 10;
              sf.rating10 = Math.max(1, Math.min(9.5, sf.rating10));
            }
          });
        }
      });
      
      // Also adjust overall scores
      if (response.overall) {
        if (typeof response.overall.currentScore10 === 'number' && response.overall.currentScore10 > 6.5) {
          const delta = response.overall.currentScore10 - 5.5;
          response.overall.currentScore10 = Math.round((5.5 + delta * compressionFactor) * 10) / 10;
        }
        if (typeof response.overall.potentialScore10 === 'number' && response.overall.potentialScore10 > 8.0) {
          response.overall.potentialScore10 = Math.min(8.5, response.overall.potentialScore10);
        }
      }
      
      // Adjust harmony/symmetry/hair
      if (response.harmony && response.harmony.rating10 > 7.0) {
        response.harmony.rating10 = Math.round((5.5 + (response.harmony.rating10 - 5.5) * compressionFactor) * 10) / 10;
      }
      if (response.symmetry && response.symmetry.rating10 > 7.0) {
        response.symmetry.rating10 = Math.round((5.5 + (response.symmetry.rating10 - 5.5) * compressionFactor) * 10) / 10;
      }
      if (response.hair && response.hair.rating10 > 7.0) {
        response.hair.rating10 = Math.round((5.5 + (response.hair.rating10 - 5.5) * compressionFactor) * 10) / 10;
      }
    }
  }
  
  // Ensure variance exists - if all scores are too close together, spread them out
  if (scores.length >= 4) {
    const variance = calculateVariance(scores);
    if (variance < 0.3) { // Too clustered
      console.log('Low variance detected, scores may be too similar');
      // Note: The AI should handle this, but we log it for debugging
    }
  }
  
  return response;
}

function calculateVariance(numbers) {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
}

app.listen(PORT, () => {
  console.log(`\n✨ Face Analyzer server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Analysis endpoint: POST http://localhost:${PORT}/api/face/analyze\n`);
  console.log('📊 Scoring calibration active - honest scores, no inflation');
});
