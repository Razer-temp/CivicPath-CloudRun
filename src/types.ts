export interface JourneyProfile {
  country: string;
  countryName: string;
  persona: string;
  language: string;
  interest?: string;
  region?: string;
  postalCode?: string;
  goal?: string;
  isFirstTimeVoter?: boolean;
  registrationStatus?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai' | 'system';
  text: string;
  timestamp?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  bio?: string;
  handle?: string;
  followersCount?: number;
  followingCount?: number;
  stamps?: number[];
  chatHistory?: ChatMessage[];
  profile?: JourneyProfile;
  hasCompletedOnboarding?: boolean;
}

export interface NewsItem {
  title: string;
  pubDate: string;
  link: string;
  thumbnail?: string;
  source?: string;
}

export interface Booth {
  id: string;
  lat: number;
  lng: number;
  name: string;
  address: string;
  distance: string;
  queueTime: string;
  accessibility: boolean;
}

export interface FallbackEntry {
  content: string;
  title?: string;
}

export type FallbackData = Record<string, FallbackEntry[]>;
