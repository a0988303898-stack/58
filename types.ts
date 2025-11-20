// Types for Geolocation
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

// Types for App State
export enum AppStep {
  LANDING,
  LOCATION_PERMISSION,
  MOOD_SELECTION,
  LOADING,
  RESULTS,
  ERROR
}

export interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  promptMod: string;
  color: string;
}

// Types for Gemini Response
export interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content?: string;
      }[];
    };
  };
}

export interface GeminiResult {
  text: string;
  places: GroundingChunk[];
}
