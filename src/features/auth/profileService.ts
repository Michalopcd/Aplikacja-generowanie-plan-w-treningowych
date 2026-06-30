import type { User as FirebaseUser } from "firebase/auth";
import { doc,getDoc, setDoc,updateDoc } from "firebase/firestore";
import type { TrainingProfile } from "../onboarding/types/onboarding";

import { db } from "../../firebase";
import type { UserProfile } from "../../types/user";

export const createUserProfile = async (user: FirebaseUser):Promise<UserProfile> => {
  const userProfile: UserProfile = {
    uid: user.uid,
    firstName: "",
    email: user.email ?? "",
    role: "user",
    onboardingCompleted: false,
    createdAt: new Date(),
  };

  await setDoc(doc(db, "users", user.uid), userProfile);
  return userProfile;
};
export const saveOnboardingData = async (
  uid: string,
  firstName: string,
  trainingProfile: TrainingProfile
) => {
  await updateDoc(doc(db, "users", uid), {
    firstName,
    trainingProfile,
    onboardingCompleted: true,
  });
};
export const getUserProfile = async (uid: string) => {
  const userDocument = await getDoc(doc(db, "users", uid));

  if (!userDocument.exists()) {
    return null;
  }

  return userDocument.data() as UserProfile;
};