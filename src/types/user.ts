export type UserRole = "user" | "admin";

export type UserProfile = {
  uid: string;
  userName: string;
  avatarUrl?: string;
  email: string;
  role: UserRole;
  onboardingCompleted: boolean;
  createdAt: Date;
};