import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FaceAnalysisResponse, Gender, ScanHistoryItem } from '@/types/face-analysis';

const FREE_SCAN_LIMIT = 3;
const SCAN_RESET_HOURS = 24;

interface AppState {
  // Premium status
  premiumEnabled: boolean;
  setPremiumEnabled: (enabled: boolean) => void;

  // Photo state
  frontPhotoUri: string | null;
  sidePhotoUri: string | null;
  setFrontPhotoUri: (uri: string | null) => void;
  setSidePhotoUri: (uri: string | null) => void;
  clearPhotos: () => void;

  // Gender selection
  gender: Gender;
  setGender: (gender: Gender) => void;

  // Analysis results
  analysisResult: FaceAnalysisResponse | null;
  setAnalysisResult: (result: FaceAnalysisResponse | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  analysisError: string | null;
  setAnalysisError: (error: string | null) => void;

  // Scan limits
  scanCount: number;
  lastScanTimestamp: number | null;
  scansRemaining: number;
  canScan: boolean;
  incrementScanCount: () => Promise<void>;
  loadScanData: () => Promise<void>;
  resetScansIfNeeded: () => Promise<void>;

  // Scan history
  scanHistory: ScanHistoryItem[];
  addToHistory: (item: ScanHistoryItem) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Premium status
  premiumEnabled: false,
  setPremiumEnabled: async (enabled) => {
    set({ premiumEnabled: enabled });
    await AsyncStorage.setItem('premiumEnabled', JSON.stringify(enabled));
  },

  // Photo state
  frontPhotoUri: null,
  sidePhotoUri: null,
  setFrontPhotoUri: (uri) => set({ frontPhotoUri: uri }),
  setSidePhotoUri: (uri) => set({ sidePhotoUri: uri }),
  clearPhotos: () => set({ frontPhotoUri: null, sidePhotoUri: null }),

  // Gender selection
  gender: 'male',
  setGender: (gender) => set({ gender }),

  // Analysis results
  analysisResult: null,
  setAnalysisResult: (result) => set({ analysisResult: result }),
  isAnalyzing: false,
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  analysisError: null,
  setAnalysisError: (error) => set({ analysisError: error }),

  // Scan limits
  scanCount: 0,
  lastScanTimestamp: null,
  scansRemaining: FREE_SCAN_LIMIT,
  canScan: true,

  loadScanData: async () => {
    try {
      const [countStr, timestampStr, premiumStr] = await Promise.all([
        AsyncStorage.getItem('scanCount'),
        AsyncStorage.getItem('lastScanTimestamp'),
        AsyncStorage.getItem('premiumEnabled'),
      ]);

      const scanCount = countStr ? parseInt(countStr, 10) : 0;
      const lastScanTimestamp = timestampStr ? parseInt(timestampStr, 10) : null;
      const premiumEnabled = premiumStr ? JSON.parse(premiumStr) : false;

      // Check if we need to reset scans
      const now = Date.now();
      const shouldReset =
        lastScanTimestamp && now - lastScanTimestamp > SCAN_RESET_HOURS * 60 * 60 * 1000;

      if (shouldReset) {
        await AsyncStorage.setItem('scanCount', '0');
        set({
          scanCount: 0,
          lastScanTimestamp: null,
          scansRemaining: FREE_SCAN_LIMIT,
          canScan: true,
          premiumEnabled,
        });
      } else {
        const scansRemaining = Math.max(0, FREE_SCAN_LIMIT - scanCount);
        set({
          scanCount,
          lastScanTimestamp,
          scansRemaining,
          canScan: premiumEnabled || scansRemaining > 0,
          premiumEnabled,
        });
      }
    } catch (error) {
      console.error('Error loading scan data:', error);
    }
  },

  resetScansIfNeeded: async () => {
    const { lastScanTimestamp } = get();
    const now = Date.now();

    if (lastScanTimestamp && now - lastScanTimestamp > SCAN_RESET_HOURS * 60 * 60 * 1000) {
      await AsyncStorage.setItem('scanCount', '0');
      set({
        scanCount: 0,
        lastScanTimestamp: null,
        scansRemaining: FREE_SCAN_LIMIT,
        canScan: true,
      });
    }
  },

  incrementScanCount: async () => {
    const { scanCount, premiumEnabled } = get();
    const newCount = scanCount + 1;
    const now = Date.now();

    await Promise.all([
      AsyncStorage.setItem('scanCount', newCount.toString()),
      AsyncStorage.setItem('lastScanTimestamp', now.toString()),
    ]);

    const scansRemaining = Math.max(0, FREE_SCAN_LIMIT - newCount);
    set({
      scanCount: newCount,
      lastScanTimestamp: now,
      scansRemaining,
      canScan: premiumEnabled || scansRemaining > 0,
    });
  },

  // Scan history
  scanHistory: [],

  loadHistory: async () => {
    try {
      const historyStr = await AsyncStorage.getItem('scanHistory');
      const history = historyStr ? JSON.parse(historyStr) : [];
      set({ scanHistory: history });
    } catch (error) {
      console.error('Error loading history:', error);
    }
  },

  addToHistory: async (item) => {
    const { scanHistory } = get();
    const newHistory = [item, ...scanHistory].slice(0, 10); // Keep last 10 scans
    await AsyncStorage.setItem('scanHistory', JSON.stringify(newHistory));
    set({ scanHistory: newHistory });
  },

  clearHistory: async () => {
    await AsyncStorage.removeItem('scanHistory');
    set({ scanHistory: [] });
  },
}));
