export interface UserProfile {
  name: string;
  email: string;
  location: string;
  occupation: string;
  keywords?: string;
  photoUrl: string | null;
}

export interface Mention {
  title: string;
  snippet: string;
  source: string;
  date: string;
  url: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface PlatformAnalysis {
  score: number;
  status: 'Active' | 'Inactive' | 'Not Found';
  summary: string;
}

export interface WebHealthData {
  score: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  mentions: Mention[];
  risks: string[];
  prominenceData: { date: string; mentions: number }[];
  platforms: {
    [key: string]: PlatformAnalysis;
  };
  lastScanned: string;
}

export enum AppState {
  ONBOARDING,
  SCANNING,
  DASHBOARD
}