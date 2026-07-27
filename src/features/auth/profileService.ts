import type { User as FirebaseUser } from "firebase/auth";
import { doc,getDoc, setDoc,updateDoc,onSnapshot, type Unsubscribe } from "firebase/firestore";
import type { TrainingProfile } from "../onboarding/types/onboarding";

import { db } from "../../firebase";
import type { UserProfile } from "../../types/user";


export  class UserProfileNotFoundError extends Error {
  constructor() {
    super("Nie znaleziono profilu użytkownika.");
    this.name = "UserProfileNotFoundError";
  }
}

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
    throw new UserProfileNotFoundError();
  }

  return userDocument.data() as UserProfile;
};


export const subscribeUserProfile = (
  uid: string,
  onUserProfileChange: (userProfile: UserProfile) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  return onSnapshot(
    doc(db, "users", uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onError(new UserProfileNotFoundError());
        return;
      }

      onUserProfileChange(snapshot.data() as UserProfile);
    },
    onError,
  );
};