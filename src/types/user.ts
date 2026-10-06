import type { TrainingProfile } from "../features/onboarding/types/onboarding";

type UserRole = "user" | "admin";

export type UserProfile = {
  uid: string;
  firstName: string;
  avatarUrl?: string;
  email: string;
  role: UserRole;
  onboardingCompleted: boolean;
  createdAt: Date;
  trainingProfile?: TrainingProfile;
};