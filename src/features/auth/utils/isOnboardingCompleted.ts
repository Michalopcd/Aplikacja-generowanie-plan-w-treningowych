import type { UserProfile } from "../../../types/user";

export const isOnboardingCompleted = (user: UserProfile): boolean => {
  if (!user.onboardingCompleted) {
    return false;
  }

  if (!user.firstName.trim()) {
    return false;
  }

  const trainingProfile = user.trainingProfile;

  if (!trainingProfile) {
    return false;
  }

  return (
    trainingProfile.age > 0 &&
    trainingProfile.height > 0 &&
    trainingProfile.weight > 0 &&
    Boolean(trainingProfile.gender) &&
    Boolean(trainingProfile.trainingLocation) &&
    trainingProfile.trainingDaysPerWeek > 0 &&
    Boolean(trainingProfile.experienceLevel) &&
    Boolean(trainingProfile.goal)
  );
};
