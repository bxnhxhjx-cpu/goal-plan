export interface Goal {
  id: string;
  title: string;
  description: string;
  targetHours: number; // Long term goal in hours
  accumulatedHours: number;
  color: string;
  category: 'Career' | 'Health' | 'Skill' | 'Project' | 'Other';
  createdAt: string;
}

export interface TimeSession {
  id: string;
  goalId: string;
  startTime: string; // ISO string
  endTime?: string; // ISO string
  durationSeconds: number;
  notes?: string;
}

export interface AIAdvice {
  summary: string;
  efficiencyScore: number;
  actionableTips: string[];
  neglectedGoals: string[];
}

export type ViewState = 'dashboard' | 'goals' | 'analytics' | 'coach';

export const CATEGORY_COLORS = {
  Career: 'bg-blue-500',
  Health: 'bg-green-500',
  Skill: 'bg-purple-500',
  Project: 'bg-orange-500',
  Other: 'bg-gray-500',
};