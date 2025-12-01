import React from 'react';

export enum FeatureType {
  FLIGHTS = 'FLIGHTS',
  HOTELS = 'HOTELS',
  PACKING_LIST = 'PACKING_LIST',
  PUBLIC_TRANSPORT = 'PUBLIC_TRANSPORT',
  EMERGENCY_INFO = 'EMERGENCY_INFO',
  PAYMENT_INFO = 'PAYMENT_INFO',
  DESTINATION_INFO = 'DESTINATION_INFO',
  FOOD_AND_DINING = 'FOOD_AND_DINING',
}

export interface SubFeature {
  id: string;
  label: string;
  icon: string; // Emoji or generic string identifier
  promptContext: string; // Specific instruction for the AI
  requiresInput?: boolean; // If true, opens a specific input form before fetching
}

export interface PackingCategory {
  name: string;
  items: string[];
}

export interface TravelResponse {
  type: 'markdown' | 'packing_list';
  markdown?: string;
  packingList?: PackingCategory[];
  groundingUrls: Array<{ title: string; uri: string }>;
}

export interface NeonButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass: string;
  subText?: string;
}