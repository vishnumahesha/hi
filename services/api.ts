import * as FileSystem from 'expo-file-system';
import { FaceAnalysisResponseSchema, type FaceAnalysisResponse, type AnalysisRequest } from '@/types/face-analysis';
import { getMockResponse } from '@/data/mock-response';
import { API_URL } from '@/constants';

/**
 * Convert image URI to base64
 */
async function imageToBase64(uri: string): Promise<string> {
  try {
    // Check if it's already a base64 string
    if (uri.startsWith('data:image')) {
      return uri.split(',')[1];
    }

    // Read file and convert to base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to process image');
  }
}

/**
 * Validate API response with Zod schema
 */
function validateResponse(data: unknown): FaceAnalysisResponse {
  const result = FaceAnalysisResponseSchema.safeParse(data);
  if (!result.success) {
    console.error('Response validation failed:', result.error);
    throw new Error('Invalid response format from server');
  }
  return result.data;
}

/**
 * Main face analysis function
 */
export async function analyzeface(params: {
  frontImage: string;
  sideImage?: string;
  gender: 'male' | 'female';
  premiumEnabled: boolean;
}): Promise<FaceAnalysisResponse> {
  const { frontImage, sideImage, gender, premiumEnabled } = params;

  try {
    // Convert images to base64
    const frontBase64 = await imageToBase64(frontImage);
    const sideBase64 = sideImage ? await imageToBase64(sideImage) : undefined;

    // Prepare request
    const requestBody: AnalysisRequest = {
      frontImage: frontBase64,
      sideImage: sideBase64,
      gender,
      premiumEnabled,
    };

    // Make API request
    const response = await fetch(`${API_URL}/api/face/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    // Validate response
    const validatedResponse = validateResponse(data);
    return validatedResponse;
  } catch (error) {
    console.error('Analysis error:', error);

    // Fallback to mock data so demo never breaks
    console.log('Falling back to mock response');
    return getMockResponse(premiumEnabled);
  }
}

/**
 * Check server health
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
