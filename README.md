# Face Analyzer

An AI-powered facial aesthetics analyzer built with Expo React Native and Claude AI.

## Features

- 📸 **Photo Capture**: Take or upload front and side profile photos
- ⭐ **Overall Rating**: Get an overall facial aesthetics score out of 10
- 👁️ **Feature Analysis**: Detailed ratings for eyes, nose, lips, cheekbones, jawline, harmony, and hair
- 💡 **Improvement Tips**: Actionable suggestions with no-cost, low-cost, and procedural options
- 🔒 **Photo Quality Checks**: Validates photo quality before analysis
- 💎 **Free & Premium Tiers**: Demo monetization with different analysis depths

## Tech Stack

- **Frontend**: Expo React Native with TypeScript
- **State Management**: Zustand
- **Animations**: React Native Reanimated
- **Backend**: Node.js + Express
- **AI**: Claude (Anthropic) for vision analysis
- **Validation**: Zod for type-safe API responses

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Anthropic API key

### Installation

1. **Clone and install dependencies:**

```bash
cd 5-Project
npm install
cd server && npm install && cd ..
```

2. **Configure environment:**

Create `server/.env`:
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
```

3. **Start the backend:**

```bash
cd server
npm start
```

4. **Start the Expo app:**

```bash
# In a new terminal, from project root
npx expo start
```

5. **Run on device/simulator:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root navigation layout
│   ├── index.tsx           # Home screen
│   ├── capture-front.tsx   # Front photo capture
│   ├── capture-side.tsx    # Side photo capture
│   ├── review.tsx          # Photo review screen
│   ├── analyzing.tsx       # Analysis loading screen
│   ├── results.tsx         # Results display
│   └── upgrade.tsx         # Premium upgrade screen
├── components/             # Reusable UI components
│   ├── Button.tsx
│   ├── RatingMeter.tsx
│   ├── CircularRating.tsx
│   ├── FeatureCard.tsx
│   ├── FeatureDetailModal.tsx
│   └── ...
├── constants/              # Theme and app constants
├── data/                   # Mock data for fallback
├── services/               # API service layer
├── store/                  # Zustand state management
├── types/                  # TypeScript types + Zod schemas
├── utils/                  # Utility functions
└── server/                 # Backend API server
```

## API Endpoints

### `POST /api/face/analyze`

Analyzes facial images and returns ratings + suggestions.

**Request:**
```json
{
  "frontImage": "base64_encoded_image",
  "sideImage": "base64_encoded_image (optional)",
  "gender": "male" | "female",
  "premiumEnabled": boolean
}
```

**Response:** See `types/face-analysis.ts` for the full schema.

## Free vs Premium

| Feature | Free | Premium |
|---------|------|---------|
| Scans per day | 3 | Unlimited |
| Analysis depth | Basic | Comprehensive |
| Fixes/suggestions | 3-5 | 15-20 |
| "Why" explanations | No | Yes |
| Feature details | Summary | Detailed |

## Demo Mode

The upgrade screen includes a demo toggle to switch between free and premium tiers without any payment integration. This is designed for hackathon demonstrations.

## Important Notes

- This app uses AI-generated assessments based on general aesthetic guidelines
- Results are estimates and do not determine personal worth
- Photo quality significantly affects analysis accuracy
- The app includes fallback mock data if the AI service is unavailable

## License

MIT
